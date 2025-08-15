'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCodeVerifier } from '@/lib/pkce'

interface VideoData {
  view_count: number
}

interface TikTokVideoResponse {
  data: {
    videos: VideoData[]
    cursor: string
    has_more: boolean
  }
}

interface TikTokTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

async function exchangeCodeForToken(code: string): Promise<string | null> {
  try {
    // Get the code verifier from session storage
    const codeVerifier = getCodeVerifier()

    console.log('Starting token exchange process...')
    console.log('Code verifier found:', !!codeVerifier)
    console.log('Code length:', code.length)

    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        codeVerifier
      })
    })

    console.log('Token API response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Token exchange failed:', errorData)
      return null
    }

    const data = await response.json()
    console.log('Token exchange successful, response keys:', Object.keys(data))
    console.log('Access token present:', !!data.access_token)
    console.log('Access token length:', data.access_token?.length || 0)
    console.log('Access token value:', data.access_token ? data.access_token.substring(0, 20) + '...' : 'NULL')
    return data.access_token
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return null
  }
}

async function testApiEndpoints(): Promise<{ working: boolean; details: any }> {
  try {
    console.log('Testing API endpoints...')
    
    // Test health check endpoint first
    const healthResponse = await fetch('/api/health')
    console.log('Health check response:', healthResponse.status, healthResponse.statusText)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('Health check data:', healthData)
      return { working: true, details: healthData }
    }
    
    return { working: false, details: { status: healthResponse.status, statusText: healthResponse.statusText } }
  } catch (error) {
    console.error('Error testing API endpoints:', error)
    return { working: false, details: error }
  }
}

async function fetchVideos(accessToken: string): Promise<{ totalViews: number; videoCount: number; message?: string } | { error: string; status: number } | null> {
  try {
    console.log('Starting video fetch with access token')
    console.log('Access token value:', accessToken ? accessToken.substring(0, 20) + '...' : 'NULL')

    // First, test if API endpoints are working
    const apiTest = await testApiEndpoints()
    if (!apiTest.working) {
      console.error('API endpoints not working:', apiTest.details)
      return { error: 'api_not_available', status: 503 }
    }

    // Try the new unified video-data route first
    console.log('Trying /api/video-data...')
    let response = await fetch('/api/video-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken })
    })

    console.log('Video-data response:', response.status, response.statusText)

    // If the unified route fails, try the tiktok-videos route
    if (!response.ok && response.status === 404) {
      console.log('Video-data route failed, trying tiktok-videos route')
      response = await fetch('/api/tiktok-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken })
      })
      console.log('TikTok-videos response:', response.status, response.statusText)
    }

    // If that fails, try the original videos route
    if (!response.ok && response.status === 404) {
      console.log('TikTok-videos route failed, trying original videos route')
      response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken })
      })
      console.log('Videos response:', response.status, response.statusText)
    }

    // If all fail, try the get-videos route
    if (!response.ok && response.status === 404) {
      console.log('Original videos route failed, trying get-videos route')
      response = await fetch('/api/get-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken })
      })
      console.log('Get-videos response:', response.status, response.statusText)
    }

    console.log('Final video API response status:', response.status, response.statusText)
    console.log('Video API response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (parseError) {
        const errorText = await response.text()
        errorData = { error: 'Failed to parse error response', details: errorText }
      }
      
      console.error('Video fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      // Return error info for 401 (expected in sandbox mode)
      if (response.status === 401) {
        return { error: 'unauthorized', status: 401 }
      }
      
      // Handle 404 specifically
      if (response.status === 404) {
        return { error: 'api_not_found', status: 404 }
      }
      
      return { error: 'video_fetch_failed', status: response.status }
    }

    const data = await response.json()
    console.log('Video fetch completed:', data)
    return data
  } catch (error) {
    console.error('Error fetching videos:', error)
    return null
  }
}

function CallbackContent() {
  const searchParams = useSearchParams()
  const [totalViews, setTotalViews] = useState(12345678) // Sample data fallback
  const [videoCount, setVideoCount] = useState(42) // Sample data fallback
  const [isLiveData, setIsLiveData] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function processCallback() {
      const code = decodeURIComponent(searchParams.get('code') || '')
      const error = searchParams.get('error') || ''
      const errorDescription = searchParams.get('error_description') || ''

      if (error) {
        setErrorMessage(errorDescription || 'Authentication failed. Please try again.')
        setErrorType('auth_error')
        setIsLoading(false)
        return
      }

      console.log('Received code:', code ? code.substring(0, 20) + '...' : 'NO CODE')
      
      if (!code) {
        setErrorMessage('Invalid callback. Please try logging in again.')
        setErrorType('invalid_callback')
        setIsLoading(false)
        return
      }

      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(code)
      
      if (accessToken) {
        console.log('Access token received, attempting to fetch videos...')
        // Fetch video data
        const videoData = await fetchVideos(accessToken)
        
        if (videoData && 'totalViews' in videoData) {
          console.log('Video data received successfully:', videoData)
          setTotalViews(videoData.totalViews)
          setVideoCount(videoData.videoCount)
          // Check if this is real data or sample data
          const isRealData = !!(videoData.message && videoData.message.includes('Real data'))
          setIsLiveData(isRealData)
          if (!isRealData) {
            setErrorMessage('Showing sample data — TikTok API access may be limited in sandbox mode.')
            setErrorType('sample_data')
          }
        } else if (videoData && 'error' in videoData) {
          if (videoData.status === 401) {
            console.log('Video fetch failed with 401 - expected in sandbox mode, showing sample data')
            // Don't show error for 401 - this is expected in sandbox mode
            setErrorMessage('Live data unavailable in sandbox mode — showing sample data instead.')
            setErrorType('sandbox_mode')
          } else if (videoData.status === 404) {
            console.log('Video API endpoint not found - this may be a deployment issue')
            setErrorMessage('API endpoint not found — this may be a temporary deployment issue. Showing sample data instead.')
            setErrorType('api_not_found')
          } else if (videoData.status === 503) {
            console.log('API endpoints not available')
            setErrorMessage('API service temporarily unavailable — showing sample data instead.')
            setErrorType('api_unavailable')
          } else {
            console.log('Video fetch failed, showing sample data')
            setErrorMessage('Unable to fetch live data — showing sample data instead.')
            setErrorType('video_fetch_error')
          }
        } else {
          console.log('Video fetch failed, showing sample data')
          setErrorMessage('Unable to fetch live data — showing sample data instead.')
          setErrorType('video_fetch_error')
        }
      } else {
        console.log('No access token received')
        setErrorMessage('Authentication failed — this may be due to app configuration or sandbox mode limitations. Showing sample data instead.')
        setErrorType('token_error')
      }

      setIsLoading(false)
    }

    processCallback()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Processing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-tiktok-primary to-tiktok-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">TV</span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              Total Views
            </h1>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-tiktok-primary mb-2">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {videoCount} video{videoCount !== 1 ? 's' : ''} counted
              </div>
            </div>

            {/* Data Source Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-6 ${
              isLiveData 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              <svg className={`w-3 h-3 mr-1 ${isLiveData ? 'text-green-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20">
                {isLiveData ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              {isLiveData ? 'Live Data' : 'Sample Data'}
            </div>

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm font-medium">
                    {errorMessage}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/" className="btn-primary w-full block">
                Back to Home
              </Link>
              
              <Link href="/auth/login" className="btn-secondary w-full block">
                Try Again
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Need help? Contact us at{' '}
                <a href="mailto:support@yourdomain.com" className="text-tiktok-primary hover:underline">
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Processing...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
