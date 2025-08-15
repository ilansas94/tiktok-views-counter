export function buildTikTokLoginURL(origin: string, state = 'profile-consent') {
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!;
  const redirect = encodeURIComponent(`${origin}/api/auth/callback`);
  const scope = encodeURIComponent('user.info.basic,video.list');
  return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}` +
         `&response_type=code&scope=${scope}&redirect_uri=${redirect}` +
         `&state=${encodeURIComponent(state)}&revoke=1&prompt=consent`;
}
