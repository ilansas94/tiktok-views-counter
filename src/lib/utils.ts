export function deriveUsernameFromVideos(videos: any[]) {
  const url = videos.find(v => v?.share_url)?.share_url as string | undefined;
  const m = url?.match(/\/@([^/]+)/);
  return m ? m[1] : null; // e.g., "sasildurmstrang"
}

export function cookieHas(name: string) {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
}
