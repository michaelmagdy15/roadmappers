import { NextResponse } from 'next/server';
import { db, users, sessions, onboardingProfiles } from '@/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('Authorization code is missing from redirect.', { status: 400 });
  }

  const clientId = process.env.WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOP_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse('Whop configuration is incomplete on the server.', { status: 500 });
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.whop.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Whop token exchange error:', errorText);
      return new NextResponse('Failed to exchange authorization code for token.', { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Whop
    const userResponse = await fetch('https://api.whop.com/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user profile from Whop');
      return new NextResponse('Failed to fetch user profile from Whop.', { status: 400 });
    }

    const userData = await userResponse.json();
    const whopUserId = userData.id;
    const email = userData.email;
    const name = userData.name || userData.username || 'Whop User';

    if (!whopUserId || !email) {
      return new NextResponse('Invalid user data returned from Whop.', { status: 400 });
    }

    // 3. Check if user exists in local database
    let existingUser = await db.select().from(users).where(eq(users.whopUserId, whopUserId)).limit(1);
    let userId: string;
    let isNewUser = false;

    if (existingUser.length === 0) {
      userId = crypto.randomUUID();
      isNewUser = true;
      
      // Determine default role (first user can be admin, otherwise student)
      const allUsers = await db.select().from(users).limit(1);
      const role = allUsers.length === 0 ? 'admin' : 'student';

      await db.insert(users).values({
        id: userId,
        whopUserId,
        email,
        name,
        role,
        createdAt: Date.now(),
      });
    } else {
      userId = existingUser[0].id;
      // Sync user details in case email or name changed on Whop
      await db.update(users).set({
        email,
        name,
      }).where(eq(users.id, userId));
    }

    // 4. Create a database session
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await db.insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt,
    });

    // 5. Set session cookie and redirect
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // If new user and student, redirect to onboarding diagnostic survey
    if (isNewUser) {
      const userRole = isNewUser ? (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0]?.role : 'student';
      if (userRole === 'student') {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    } else {
      // Check if student has already completed onboarding
      const user = existingUser[0];
      if (user?.role === 'student') {
        const onboarding = await db.select().from(onboardingProfiles).where(eq(onboardingProfiles.userId, userId)).limit(1);
        if (onboarding.length === 0) {
          const redirectResponse = NextResponse.redirect(new URL('/onboarding', request.url));
          redirectResponse.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
          return redirectResponse;
        }
      }
    }

    return response;
  } catch (error) {
    console.error('OAuth callback execution error:', error);
    return new NextResponse('Authentication callback encountered an internal server error.', { status: 500 });
  }
}
