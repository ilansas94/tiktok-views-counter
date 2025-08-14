import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL

  if (!clientKey || !clientSecret || !baseUrl) {
    return NextResponse.json({
      error: 'Missing environment variables',
      hasClientKey: !!clientKey,
      hasClientSecret: !!clientSecret,
      hasBaseUrl: !!baseUrl
    }, { status: 500 })
  }

  // Test basic TikTok API connectivity
  try {
    const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test_token',
        'Content-Type': 'application/json',
      }
    })

    return NextResponse.json({
      status: 'API endpoint reachable',
      responseStatus: response.status,
      responseStatusText: response.statusText,
      environment: {
        clientKeyPrefix: clientKey.substring(0, 8) + '...',
        baseUrl,
        isProduction: process.env.NODE_ENV === 'production'
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to reach TikTok API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
