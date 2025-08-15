import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== HEALTH CHECK API ROUTE CALLED ===')
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)
  console.log('User agent:', request.headers.get('user-agent'))
  
  return NextResponse.json({ 
    message: 'Health check successful',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    deploymentVersion: 'v2.1.0',
    apiRoutes: [
      '/api/health',
      '/api/test',
      '/api/fetch-videos',
      '/api/video-data',
      '/api/tiktok-videos',
      '/api/videos',
      '/api/get-videos',
      '/api/auth/token'
    ]
  })
}

export async function POST(request: NextRequest) {
  console.log('=== HEALTH CHECK POST ROUTE CALLED ===')
  
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: 'Health check POST successful',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'healthy'
    })
  } catch (error) {
    return NextResponse.json({ 
      message: 'Health check POST successful (no body)',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    })
  }
}
