import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: 'Test POST endpoint is working',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid JSON in request body',
      status: 'error'
    }, { status: 400 })
  }
}
