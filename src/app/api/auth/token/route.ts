import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, codeVerifier } = await request.json()
    
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL

    console.log('Environment check:', {
      hasClientKey: !!clientKey,
      hasClientSecret: !!clientSecret,
      hasBaseUrl: !!baseUrl,
      clientKeyLength: clientKey?.length || 0,
      clientSecretLength: clientSecret?.length || 0,
      baseUrl: baseUrl
    })

    if (!clientKey || !clientSecret || !baseUrl) {
      console.error('Missing TikTok OAuth credentials')
      return NextResponse.json({ 
        error: 'Missing environment variables',
        hasClientKey: !!clientKey,
        hasClientSecret: !!clientSecret,
        hasBaseUrl: !!baseUrl
      }, { status: 500 })
    }

    console.log('Attempting token exchange with:', {
      clientKey: clientKey.substring(0, 8) + '...',
      baseUrl,
      code: code.substring(0, 10) + '...',
      hasCodeVerifier: !!codeVerifier,
      redirectUri: `${baseUrl}/auth/callback`
    })

    const tokenRequestBody: any = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${baseUrl}/auth/callback`
    }

    // Add code_verifier if available (for PKCE)
    if (codeVerifier) {
      tokenRequestBody.code_verifier = codeVerifier
    }

    console.log('Token request body (sanitized):', {
      client_key: tokenRequestBody.client_key.substring(0, 8) + '...',
      client_secret: '***',
      code: tokenRequestBody.code.substring(0, 10) + '...',
      grant_type: tokenRequestBody.grant_type,
      redirect_uri: tokenRequestBody.redirect_uri,
      has_code_verifier: !!tokenRequestBody.code_verifier
    })

    console.log('Full redirect URI being sent to TikTok:', tokenRequestBody.redirect_uri)
    console.log('Expected redirect URI format:', `${baseUrl}/auth/callback`)

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenRequestBody)
    })

    console.log('TikTok API response status:', response.status, response.statusText)
    console.log('TikTok API response headers:', Object.fromEntries(response.headers.entries()))

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

    const responseText = await response.text()
    console.log('Raw TikTok API response:', responseText)
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse TikTok API response as JSON:', parseError)
      return NextResponse.json({ 
        error: 'Invalid JSON response from TikTok',
        details: 'Response could not be parsed as JSON',
        rawResponse: responseText.substring(0, 200) + '...'
      }, { status: 500 })
    }
    
    console.log('Parsed TikTok API response data:', data)
    console.log('Response keys:', Object.keys(data))
    console.log('Response values:', Object.values(data))
    
    // Check if this is an error response from TikTok
    if (data.error || data.error_code || data.error_description) {
      console.error('TikTok API returned an error:', data)
      return NextResponse.json({ 
        error: 'TikTok API error',
        details: data.error_description || data.error || 'Unknown TikTok API error',
        tiktokError: data
      }, { status: 400 })
    }
    
    // Check if the response is empty or missing access_token
    if (!data || !data.access_token) {
      console.error('Token response is empty or missing access_token:', data)
      return NextResponse.json({ 
        error: 'Invalid token response from TikTok',
        details: 'Response is empty or missing access_token',
        responseKeys: data ? Object.keys(data) : 'no data',
        responseData: data
      }, { status: 500 })
    }
    
    console.log('Token exchange successful, access token received')
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
