import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    
    if (!accessToken) {
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

      // Prepare request body
      const requestBody: any = {
        max_count: 20
      }
      
      if (cursor) {
        requestBody.cursor = cursor
      }

      console.log('Video API request body:', requestBody)

      const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
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
    console.error('Error fetching videos:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
