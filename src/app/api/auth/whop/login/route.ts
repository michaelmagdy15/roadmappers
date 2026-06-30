import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper to base64url encode a buffer
function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function GET(request: Request) {
  const clientId = process.env.WHOP_CLIENT_ID;
  const redirectUri = process.env.WHOP_REDIRECT_URI;

  // Developer Bypass Gate
  if (!clientId || clientId === 'your_whop_client_id_here') {
    return NextResponse.redirect(new URL('/developer-login', request.url));
  }

  if (!redirectUri) {
    return new NextResponse('Whop configuration is missing on the server.', { status: 500 });
  }

  // 1. Generate PKCE verifier and challenge
  const verifierBytes = crypto.randomBytes(32);
  const codeVerifier = base64UrlEncode(verifierBytes);

  const challengeHash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = base64UrlEncode(challengeHash);

  // 2. Build Whop OAuth URL with PKCE parameters
  const authUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const response = NextResponse.redirect(authUrl);

  // 3. Save code verifier in a secure HTTP-only cookie
  response.cookies.set('whop_oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}
