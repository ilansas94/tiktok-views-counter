import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, codeVerifier } = await request.json()
    
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL

    if (!clientKey || !clientSecret || !baseUrl) {
      console.error('Missing TikTok OAuth credentials')
      return NextResponse.json({ 
        error: 'Missing environment variables',
        hasClientKey: !!clientKey,
        hasClientSecret: !!clientSecret,
        hasBaseUrl: !!baseUrl
      }, { status: 500 })
    }

    const redirectUri = `${baseUrl}/auth/callback`
    
    console.log('Attempting token exchange with:', {
      clientKey: clientKey.substring(0, 8) + '...',
      baseUrl,
      redirectUri,
      code: code.substring(0, 10) + '...',
      hasCodeVerifier: !!codeVerifier
    })

    const tokenRequestBody: any = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }

    // Add code_verifier if available (for PKCE)
    if (codeVerifier) {
      tokenRequestBody.code_verifier = codeVerifier
    }

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenRequestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      return NextResponse.json({ 
        error: 'Token exchange failed',
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('Token exchange response from TikTok:', {
      hasData: !!data,
      dataKeys: Object.keys(data || {}),
      hasAccessToken: !!data?.access_token,
      accessTokenLength: data?.access_token?.length || 0
    })
    
    if (!data || !data.access_token) {
      console.error('No access token in TikTok response:', data)
      return NextResponse.json({ 
        error: 'No access token received from TikTok',
        details: data
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    })
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
