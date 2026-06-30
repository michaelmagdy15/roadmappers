import { cookies } from 'next/headers';
import { db, sessions, users } from '@/db';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const sessionRecord = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (sessionRecord.length === 0) {
      return null;
    }

    const { session, user } = sessionRecord[0];

    // Verify session expiration
    if (Date.now() > session.expiresAt) {
      // Clean up expired session asynchronously
      db.delete(sessions).where(eq(sessions.id, sessionId)).catch(console.error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Failed to retrieve current user from session:', error);
    return null;
  }
}
