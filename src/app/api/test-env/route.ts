import { NextResponse } from 'next/server'

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL
  const publicClientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY

  return NextResponse.json({
    environment: {
      hasClientKey: !!clientKey,
      hasClientSecret: !!clientSecret,
      hasBaseUrl: !!baseUrl,
      hasPublicClientKey: !!publicClientKey,
      clientKeyLength: clientKey?.length || 0,
      clientSecretLength: clientSecret?.length || 0,
      baseUrl: baseUrl,
      publicClientKeyLength: publicClientKey?.length || 0
    },
    message: 'Environment check completed'
  })
}
