import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/callback`; // MUST match portal exactly

  if (!code) {
    return NextResponse.redirect(new URL('/', origin));
  }

  // Exchange code -> token
  const tokenResp = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenJson = await tokenResp.json().catch(() => ({} as any));
  if (!tokenResp.ok || !tokenJson?.access_token) {
    if (state.includes('debug')) {
      return NextResponse.json({ ok: false, step: 'token', tokenJson }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/?err=token', origin));
  }

  // Who am I (helps verify which account authenticated)
  const whoResp = await fetch(
    'https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url',
    { headers: { Authorization: `Bearer ${tokenJson.access_token}` } }
  );
  const whoJson = await whoResp.json().catch(() => ({} as any));

  // Store token cookie
  cookies().set('tt_access', encodeURIComponent(tokenJson.access_token), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  if (state.includes('debug')) {
    return NextResponse.json({
      ok: true,
      step: 'done',
      who: whoJson,
      token: { expires_in: tokenJson.expires_in },
    });
  }

  return NextResponse.redirect(new URL('/', origin));
}
