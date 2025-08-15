import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== TEST API ROUTE CALLED ===')
  console.log('URL:', request.url)
  
  return NextResponse.json({ 
    message: 'Test API route is working',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}

export async function POST(request: NextRequest) {
  console.log('=== TEST API POST ROUTE CALLED ===')
  console.log('URL:', request.url)
  
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: 'Test POST route is working',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json({ 
      message: 'Test POST route is working (no body)',
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  }
}
