import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

  // 1. Generate PKCE verifier and challenge using native base64url encoding
  const verifierBytes = crypto.randomBytes(32);
  const codeVerifier = verifierBytes.toString('base64url');

  const challengeHash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = challengeHash.toString('base64url');

  // 2. Generate a random nonce for OIDC security
  const nonce = crypto.randomBytes(16).toString('hex');

  // 3. Build Whop OAuth URL using the official Whop OAuth 2.1 authorization endpoint with scope
  const authUrl = `https://api.whop.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid%20email&nonce=${nonce}`;

  const response = NextResponse.redirect(authUrl);

  // 4. Save code verifier in a secure HTTP-only cookie
  response.cookies.set('whop_oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}
