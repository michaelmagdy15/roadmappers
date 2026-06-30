import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('session_id');
  
  const response = NextResponse.redirect(new URL('/', request.url));
  // Explicitly clear the cookie with max-age 0 to force browser removal
  response.cookies.set('session_id', '', { path: '/', maxAge: 0 });

  return response;
}
