import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const avatarUrl = searchParams.get('url')
  
  if (!avatarUrl) {
    return NextResponse.json({ error: 'No avatar URL provided' }, { status: 400 })
  }

  try {
    const response = await fetch(avatarUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error fetching avatar:', error)
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 })
  }
}
