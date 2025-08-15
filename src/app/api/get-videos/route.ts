import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== GET-VIDEOS API ROUTE CALLED ===')
  
  try {
    const body = await request.json()
    const { accessToken } = body
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    // Return sample data for testing
    return NextResponse.json({ 
      totalViews: 9876543,
      videoCount: 15,
      message: 'Sample data from get-videos route'
    })
    
  } catch (error) {
    console.error('Error in get-videos API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Get-videos API endpoint is working',
    status: 'success'
  })
}
