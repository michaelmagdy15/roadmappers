import { NextResponse } from 'next/server';

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

  const authUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
