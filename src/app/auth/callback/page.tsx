import { Suspense } from 'react'
import Link from 'next/link'

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
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL

    if (!clientKey || !clientSecret || !baseUrl) {
      console.error('Missing TikTok OAuth credentials')
      return null
    }

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${baseUrl}/auth/callback`
      })
    })

    if (!response.ok) {
      console.error('Token exchange failed:', response.status, response.statusText)
      return null
    }

    const data: TikTokTokenResponse = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return null
  }
}

async function fetchVideos(accessToken: string): Promise<{ totalViews: number; videoCount: number } | null> {
  try {
    let totalViews = 0
    let videoCount = 0
    let cursor = ''
    let hasMore = true

    while (hasMore) {
      const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_count: 20,
          ...(cursor && { cursor })
        })
      })

      if (!response.ok) {
        console.error('Video list API failed:', response.status, response.statusText)
        return null
      }

      const data: TikTokVideoResponse = await response.json()
      
      // Sum view counts
      data.data.videos.forEach(video => {
        totalViews += video.view_count
        videoCount++
      })

      cursor = data.data.cursor
      hasMore = data.data.has_more
    }

    return { totalViews, videoCount }
  } catch (error) {
    console.error('Error fetching videos:', error)
    return null
  }
}

async function CallbackContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const code = searchParams.code as string
  const error = searchParams.error as string
  const errorDescription = searchParams.error_description as string

  let totalViews = 12345678 // Sample data fallback
  let videoCount = 42 // Sample data fallback
  let isLiveData = false
  let errorMessage = ''

  if (error) {
    errorMessage = errorDescription || 'Authentication failed. Please try again.'
  } else if (code) {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code)
    
    if (accessToken) {
      // Fetch video data
      const videoData = await fetchVideos(accessToken)
      
      if (videoData) {
        totalViews = videoData.totalViews
        videoCount = videoData.videoCount
        isLiveData = true
      } else {
        errorMessage = 'Unable to fetch live data — showing sample data instead.'
      }
    } else {
      errorMessage = 'Unable to fetch live data — showing sample data instead.'
    }
  } else {
    errorMessage = 'Invalid callback. Please try logging in again.'
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

export default function CallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Processing...</p>
        </div>
      </div>
    }>
      <CallbackContent searchParams={searchParams} />
    </Suspense>
  )
}
