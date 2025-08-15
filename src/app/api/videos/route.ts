import { NextRequest, NextResponse } from 'next/server'

// Force redeploy to ensure API route is properly deployed
export async function POST(request: NextRequest) {
  console.log('Videos API route called - POST method')
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    const body = await request.json()
    console.log('Request body keys:', Object.keys(body))
    
    const { accessToken } = body
    
    if (!accessToken) {
      console.log('No access token provided')
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    console.log('Starting video fetch with access token:', accessToken.substring(0, 20) + '...')

    let totalViews = 0
    let videoCount = 0
    let cursor = ''
    let hasMore = true
    let requestCount = 0

    console.log('Starting video fetch with access token')

    while (hasMore && requestCount < 5) { // Limit to 5 requests to prevent infinite loops
      requestCount++
      console.log(`Making video list request #${requestCount}`)

      // Use the correct TikTok video list endpoint with GET method
      const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      console.log('Video API response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Video list API failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestCount
        })
        
        // Handle 401 errors gracefully (expected in sandbox mode)
        if (response.status === 401) {
          console.log('Video API returned 401 - expected in sandbox mode')
          return NextResponse.json({ 
            error: 'unauthorized',
            status: 401,
            details: 'Video API access denied - expected in sandbox mode'
          }, { status: 401 })
        }
        
        return NextResponse.json({ 
          error: 'Failed to fetch videos',
          status: response.status,
          details: errorText
        }, { status: response.status })
      }

      const data = await response.json()
      console.log('Video list response:', {
        videoCount: data.data?.videos?.length || 0,
        hasMore: data.data?.has_more || false,
        cursor: data.data?.cursor || null
      })

      if (data.data?.videos) {
        data.data.videos.forEach((video: any) => {
          totalViews += video.view_count || 0
          videoCount++
        })
      }

      hasMore = data.data?.has_more || false
      cursor = data.data?.cursor || ''
    }

    console.log('Video fetch completed:', { totalViews, videoCount })
    return NextResponse.json({ totalViews, videoCount })
  } catch (error) {
    console.error('Error in videos API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Add explicit GET method for testing
export async function GET(request: NextRequest) {
  console.log('Videos API route called - GET method')
  console.log('Request URL:', request.url)
  
  return NextResponse.json({ 
    message: 'Videos API endpoint is working',
    method: 'GET',
    timestamp: new Date().toISOString(),
    url: request.url
  })
}
