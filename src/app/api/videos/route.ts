import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== VIDEOS API ROUTE CALLED ===')
  console.log('Method:', request.method)
  console.log('URL:', request.url)
  
  try {
    const body = await request.json()
    console.log('Request body received:', Object.keys(body))
    
    const { accessToken } = body
    
    if (!accessToken) {
      console.log('No access token provided')
      return NextResponse.json({ 
        error: 'Access token required',
        status: 400 
      }, { status: 400 })
    }

    console.log('Access token received:', accessToken.substring(0, 20) + '...')

    // Fetch real data from TikTok API
    let totalViews = 0
    let videoCount = 0
    let cursor = ''
    let hasMore = true
    let requestCount = 0

    console.log('Starting to fetch real video data from TikTok API')

    while (hasMore && requestCount < 5) { // Limit to 5 requests to prevent infinite loops
      requestCount++
      console.log(`Making TikTok video list request #${requestCount}`)

      // Build the TikTok API URL with cursor if available
      let apiUrl = 'https://open.tiktokapis.com/v2/video/list/'
      if (cursor) {
        apiUrl += `?cursor=${cursor}`
      }

      // Call the TikTok video list endpoint
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      console.log('TikTok API response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TikTok video list API failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestCount
        })
        
        // Handle 401 errors gracefully (expected in sandbox mode)
        if (response.status === 401) {
          console.log('TikTok API returned 401 - expected in sandbox mode')
          return NextResponse.json({ 
            error: 'unauthorized',
            status: 401,
            details: 'Video API access denied - expected in sandbox mode'
          }, { status: 401 })
        }
        
        return NextResponse.json({ 
          error: 'Failed to fetch videos from TikTok',
          status: response.status,
          details: errorText
        }, { status: response.status })
      }

      const data = await response.json()
      console.log('TikTok video list response:', {
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

    console.log('Real video data fetch completed:', { totalViews, videoCount })
    return NextResponse.json({ 
      totalViews, 
      videoCount,
      message: 'Real data fetched from TikTok API'
    })
    
  } catch (error) {
    console.error('Error in videos API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  console.log('=== VIDEOS API GET ROUTE CALLED ===')
  console.log('URL:', request.url)
  
  return NextResponse.json({ 
    message: 'Videos API endpoint is working',
    method: 'GET',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}
