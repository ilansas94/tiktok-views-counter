export function buildTikTokAuthorizeUrl() {
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!;
  const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI!;
  const scopes = (process.env.NEXT_PUBLIC_TIKTOK_SCOPES ?? 'user.info.basic,video.list,user.info.profile').trim();
  const state = Math.random().toString(36).slice(2);
  const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
  url.searchParams.set('client_key', clientKey);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scopes);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  if (process.env.NEXT_PUBLIC_TIKTOK_PROMPT_CONSENT === '1') {
    url.searchParams.set('prompt', 'consent');
  }
  return url.toString();
}
