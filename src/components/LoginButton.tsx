'use client';
import { buildTikTokAuthorizeUrl } from '@/lib/tiktokAuth';

export function LoginButton({ className = "btn-primary text-lg px-8 py-4" }: { className?: string }) {
  const href = buildTikTokAuthorizeUrl();
  return <a className={className} href={href}>Login with TikTok</a>;
}
