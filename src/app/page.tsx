'use client'

import Link from 'next/link'
import { ViewsCard } from '@/components/ViewsCard'
import { HowItWorks } from '@/components/HowItWorks'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

async function fetchVideos(cursor = 0) {
  const r = await fetch('/api/videos', {
    method: 'POST',
    credentials: 'include',                  // IMPORTANT: send tt_access cookie
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor, max_count: 20 }),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(`Video fetch failed: ${JSON.stringify(j)}`)
  return j
}

function AuthenticatedViewsCard() {
  const router = useRouter()
  const [totalViews, setTotalViews] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [isLiveData, setIsLiveData] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [whoamiInfo, setWhoamiInfo] = useState<any>(null)
  const [statusInfo, setStatusInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/debug/whoami')
        if (response.ok) {
          const data = await response.json()
          if (data.ok && data.data?.data) {
            setUserInfo(data.data.data)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    async function loadVideos() {
      setErrorMessage('')
      setDebugInfo(null)
      setWhoamiInfo(null)
      setStatusInfo(null)
      
      try {
        const res = await fetch('/api/videos', {
          method: 'POST',
          credentials: 'include',                  // IMPORTANT: send tt_access cookie
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cursor: 0, max_count: 20 }),
        });

        const data = await res.json();
        if (!res.ok) {
          const msg =
            data?.details?.error?.message ||
            data?.details?.message ||
            data?.error || 'Unknown error';
          throw new Error(msg);
        }

        const vids = Array.isArray(data?.videos) ? data.videos : [];
        setVideoCount(vids.length);
        setTotalViews(Number(data?.total_views ?? 0));
        setIsLiveData(true);
        
        if (vids.length === 0) {
          setErrorMessage('No videos found in response')
          
          // Fetch diagnostic info when no videos found
          try {
            const [debugResponse, whoamiResponse, statusResponse] = await Promise.all([
              fetch('/api/tiktok/debug'),
              fetch('/api/tiktok/whoami'),
              fetch('/api/tiktok/status')
            ])
            
            const debugData = await debugResponse.json()
            const whoamiData = await whoamiResponse.json()
            const statusData = await statusResponse.json()
            
            setDebugInfo(debugData)
            setWhoamiInfo(whoamiData)
            setStatusInfo(statusData)
          } catch (debugError) {
            console.error('Diagnostic fetch failed:', debugError)
          }
        }
      } catch (e: any) {
        setVideoCount(0);
        setTotalViews(0);
        setErrorMessage(e.message || String(e));
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth()
    loadVideos()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      })
      if (response.ok) {
        // Clear local state
        setUserInfo(null)
        // Refresh the page to update all components
        window.location.reload()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="card max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-md w-full">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Total Views
        </h3>
        
        <div className="mb-4">
          <span className="text-4xl md:text-5xl font-bold gradient-text">
            {totalViews.toLocaleString()}
          </span>
        </div>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 bg-green-500/20 text-green-400 border border-green-500/30">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Live Data
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          {videoCount} video{videoCount !== 1 ? 's' : ''} counted
        </div>

        {!isLoading && !errorMessage && videoCount === 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-400 text-sm font-medium">
                No videos found in response
              </span>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
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

        {/* Enhanced diagnostic hints when videos.length === 0 */}
        {debugInfo && debugInfo.count === 0 && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-blue-400 text-sm w-full">
                <div className="font-medium mb-2">Diagnostic Information:</div>
                
                {/* List mode and fieldset info */}
                {debugInfo.list_mode && (
                  <div className="mb-2 text-xs">
                    <span className="font-medium">List mode used:</span> {debugInfo.list_mode}
                    {debugInfo.fieldset_used && (
                      <span className="ml-2">
                        <span className="font-medium">Fields:</span> {debugInfo.fieldset_used.join(', ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Username from whoami */}
                {whoamiInfo?.raw?.data?.user?.username && (
                  <div className="mb-2 text-xs">
                    <span className="font-medium">Username:</span> {whoamiInfo.raw.data.user.username}
                  </div>
                )}

                {/* Client key info */}
                {statusInfo?.client_key && (
                  <div className="mb-2 text-xs">
                    <span className="font-medium">Client key:</span> {statusInfo.client_key}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-blue-500/30">
                  <div className="font-medium mb-1">Troubleshooting Steps:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• If your app is in Sandbox, TikTok only returns data for accounts listed under Sandbox → Target Users. Add the exact username shown above, then logout and login again.</li>
                    <li>• If list_mode=minimal returns videos → it was a field restriction; keep minimal fields.</li>
                    <li>• If both modes return 0 → it&apos;s Sandbox targeting or wrong account.</li>
                  </ul>
                </div>

                {/* Hard logout button */}
                <button
                  onClick={handleLogout}
                  className="mt-3 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors"
                >
                  Hard Logout & Re-auth
                </button>
              </div>
            </div>
          </div>
        )}

        {!isAuthLoading && !userInfo && (
          <div className="mt-4">
            <Link href="/auth/login" className="btn-primary w-full block">
              Login with TikTok
            </Link>
          </div>
        )}
        
        {!isAuthLoading && userInfo && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">
              Logged in as: {userInfo.display_name}
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary w-full block"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/debug/whoami')
        if (response.ok) {
          const data = await response.json()
          if (data.ok && data.data?.data) {
            setUserInfo(data.data.data)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tiktok-dark via-tiktok-dark-light to-tiktok-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Total views across your TikTok —{' '}
              <span className="gradient-text">in one number.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              Connect your account to see the sum of views across all your videos.
            </p>
            
            {!isAuthLoading && !userInfo && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
                <Link href="/auth/login" className="btn-primary text-lg px-8 py-4">
                  Login with TikTok
                </Link>
                <span className="text-gray-400 text-sm">
                  Free • No data stored • Secure OAuth
                </span>
              </div>
            )}
            
            {!isAuthLoading && userInfo && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
                <div className="flex items-center space-x-3">
                  <img 
                    src={userInfo.avatar_url} 
                    alt={userInfo.display_name}
                    className="w-12 h-12 rounded-full border-2 border-tiktok-primary"
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold">{userInfo.display_name}</div>
                    <div className="text-gray-400 text-sm">Welcome back!</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="py-16 bg-tiktok-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Your Total Views
            </h2>
            <p className="text-gray-300 text-lg">
              Connect your account to see your actual total views
            </p>
          </div>
          
          <div className="flex justify-center">
            <AuthenticatedViewsCard />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  )
}
