// PKCE (Proof Key for Code Exchange) utilities for TikTok OAuth

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(digest))
}

function base64URLEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...Array.from(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function storeCodeVerifier(verifier: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('tiktok_code_verifier', verifier)
  }
}

export function getCodeVerifier(): string | null {
  if (typeof window !== 'undefined') {
    const verifier = sessionStorage.getItem('tiktok_code_verifier')
    sessionStorage.removeItem('tiktok_code_verifier') // Clean up after use
    return verifier
  }
  return null
}
