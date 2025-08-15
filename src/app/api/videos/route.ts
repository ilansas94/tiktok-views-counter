import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== VIDEOS API ROUTE CALLED ===')
  console.log('Method:', request.method)
  console.log('URL:', request.url)
  console.log('Headers:', Object.fromEntries(request.headers.entries()))
  
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

    // For now, return sample data to test if the route is working
    console.log('Returning sample data for testing')
    return NextResponse.json({ 
      totalViews: 12345678,
      videoCount: 42,
      message: 'API route is working - sample data returned'
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
