import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    // First, get the user info to get their TikTok username
    console.log('Getting user info first...')
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('User info API failed:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: errorText
      })
      return NextResponse.json({ 
        error: 'Failed to get user info',
        status: userResponse.status,
        details: errorText
      }, { status: userResponse.status })
    }

    const userData = await userResponse.json()
    console.log('User info response:', userData)

    let totalViews = 0
    let videoCount = 0
    let cursor = ''
    let hasMore = true
    let requestCount = 0

    console.log('Starting video fetch with access token')

    while (hasMore && requestCount < 5) { // Limit to 5 requests to prevent infinite loops
      requestCount++
      console.log(`Making video list request #${requestCount}`)

      const requestBody = {
        max_count: 20,
        fields: ['id', 'title', 'view_count', 'like_count', 'comment_count', 'share_count'],
        ...(cursor && { cursor })
      }

      console.log('Making video list request with:', requestBody)

      // Try the video list endpoint
      const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Video list API failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestCount
        })
        return NextResponse.json({ 
          error: 'Failed to fetch videos',
          status: response.status,
          details: errorText
        }, { status: response.status })
      }

      const data = await response.json()
      
      // Check if the response contains an error
      if (data.error) {
        console.error('TikTok API returned error:', data.error)
        return NextResponse.json({ 
          error: 'TikTok API error',
          details: data.error
        }, { status: 400 })
      }
      console.log('Video list response:', {
        videoCount: data.data?.videos?.length || 0,
        hasMore: data.data?.has_more || false,
        cursor: data.data?.cursor || null,
        fullResponse: data
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
    
    // Return success even if no videos found
    return NextResponse.json({ 
      totalViews, 
      videoCount,
      message: videoCount === 0 ? 'No videos found for this account' : null
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
