import { NextResponse } from 'next/server'

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const appBaseUrl = process.env.APP_BASE_URL
  const scopes = process.env.TIKTOK_SCOPES

  const isValid = !!(clientKey && appBaseUrl && scopes)

  return NextResponse.json({
    isValid,
    hasClientKey: !!clientKey,
    hasBaseUrl: !!appBaseUrl,
    hasScopes: !!scopes,
  })
}
