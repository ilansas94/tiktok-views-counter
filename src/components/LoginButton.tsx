'use client';
import { buildTikTokLoginURL } from '@/lib/tiktokLogin';

export function LoginButton({ className = "btn-primary text-lg px-8 py-4" }: { className?: string }) {
  const href = buildTikTokLoginURL(typeof window !== 'undefined' ? window.location.origin : '');
  return <a className={className} href={href}>Login with TikTok</a>;
}
