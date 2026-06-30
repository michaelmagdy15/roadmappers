import { NextResponse } from 'next/server';
import { db, users, enrollments, courses } from '@/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: Request) {
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  const signature = request.headers.get('x-whop-signature');
  const rawBody = await request.text();

  // 1. Verify Webhook Signature (Security Gate)
  if (webhookSecret && signature) {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const expectedSignature = hmac.update(rawBody).digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Unauthorized Whop webhook attempt: Signature mismatch.');
      return new NextResponse('Invalid signature', { status: 400 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    // In production, signature verification is mandatory
    console.error('Missing Webhook Secret or Signature in production environment.');
    return new NextResponse('Configuration error', { status: 500 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const data = payload.data;

    if (!eventType || !data) {
      return new NextResponse('Invalid webhook payload structure.', { status: 400 });
    }

    console.log(`Processing Whop Webhook Event: ${eventType} (Membership: ${data.id})`);

    // Extract core fields safely
    const whopMembershipId = data.id;
    const whopUserId = data.user_id || data.user?.id;
    const whopProductId = data.product_id || data.product?.id;
    const email = data.email || data.user?.email;
    const name = data.user?.name || data.user?.username || 'Whop Student';

    if (!whopMembershipId || !whopUserId || !whopProductId) {
      console.warn('Webhook received but missing critical identifiers:', {
        whopMembershipId,
        whopUserId,
        whopProductId
      });
      return new NextResponse('Missing identifiers', { status: 400 });
    }

    // 2. Fetch course by Whop Product ID
    const courseRecord = await db
      .select()
      .from(courses)
      .where(eq(courses.whopProductId, whopProductId))
      .limit(1);

    if (courseRecord.length === 0) {
      console.warn(`Webhook received for unknown Whop Product ID: ${whopProductId}`);
      // Return 200 to prevent Whop from retrying, but log the issue
      return new NextResponse('Course not found, logged.', { status: 200 });
    }

    const courseId = courseRecord[0].id;

    // 3. Find or create user record
    let userRecord = await db
      .select()
      .from(users)
      .where(eq(users.whopUserId, whopUserId))
      .limit(1);

    let userId: string;

    if (userRecord.length === 0) {
      userId = crypto.randomUUID();
      const userEmail = email || `${whopUserId}@whop.user`;

      await db.insert(users).values({
        id: userId,
        whopUserId,
        email: userEmail,
        name,
        role: 'student', // default role
        createdAt: Date.now(),
      });
    } else {
      userId = userRecord[0].id;
    }

    // 4. Handle Activation & Deactivation events
    if (eventType === 'membership.activated' || eventType === 'membership.went_active') {
      // Find existing enrollment
      const existingEnrollment = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.whopMembershipId, whopMembershipId))
        .limit(1);

      if (existingEnrollment.length === 0) {
        await db.insert(enrollments).values({
          id: crypto.randomUUID(),
          userId,
          courseId,
          whopMembershipId,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        await db
          .update(enrollments)
          .set({
            status: 'active',
            updatedAt: Date.now(),
          })
          .where(eq(enrollments.whopMembershipId, whopMembershipId));
      }
      console.log(`Successfully activated course access for User: ${userId} on Course: ${courseId}`);
    } 
    else if (eventType === 'membership.deactivated' || eventType === 'membership.went_inactive') {
      await db
        .update(enrollments)
        .set({
          status: 'inactive',
          updatedAt: Date.now(),
        })
        .where(eq(enrollments.whopMembershipId, whopMembershipId));
      console.log(`Successfully deactivated course access for Membership: ${whopMembershipId}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Failed to execute Whop webhook handler:', error);
    return new NextResponse('Internal Webhook Error', { status: 500 });
  }
}
