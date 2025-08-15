import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const redirectUri = `${origin}/api/auth/callback`;
  
  // Log granted scopes from TikTok
  const granted = url.searchParams.get('granted_scopes') ?? '';
  console.log('TikTok granted_scopes:', granted);
  
  if (!code) {
    if (state.includes('debug')) {
      return NextResponse.json({ ok: false, step: 'no_code' }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/', origin));
  }

  // Exchange code -> token
  const tokenResp = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
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

  // Store token so /api/videos works regardless of whoami
  cookies().set('tt_access', encodeURIComponent(tokenJson.access_token), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24,
  });

  // Determine which scopes were actually granted for THIS token
  const scopesStr: string = tokenJson.scope || tokenJson.scopes || '';
  const scopes = new Set(scopesStr.split(/[ ,]+/).filter(Boolean));
  const needsProfileScope = !scopes.has('user.info.basic');

  // Expose tiny, short-lived, non-httpOnly flags the client can read
  cookies().set('granted_scopes', scopesStr || 'none', {
    httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 600,
  });
  cookies().set('needs_profile_scope', needsProfileScope ? '1' : '0', {
    httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 600,
  });

  // Best-effort whoami (don't block if the scope is missing)
  let whoJson = {};
  try {
    const whoResp = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url',
      { headers: { Authorization: `Bearer ${tokenJson.access_token}` } },
    );
    whoJson = await whoResp.json().catch(() => ({}));
  } catch {}

  if (state.includes('debug')) {
    return NextResponse.json({
      ok: true,
      step: 'done',
      who: whoJson,
      token: { expires_in: tokenJson.expires_in },
      scopes: scopesStr,
      needsProfileScope,
    });
  }

  return NextResponse.redirect(new URL('/', origin));
}
