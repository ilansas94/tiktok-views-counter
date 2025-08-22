'use client'

import Link from 'next/link'
import { ViewsCard } from '@/components/ViewsCard'
import { HowItWorks } from '@/components/HowItWorks'
import { Leaderboard } from '@/components/Leaderboard'
import { Toast } from '@/components/Toast'
import { LoginButton } from '@/components/LoginButton'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cookieHas, deriveUsernameFromVideos } from '@/lib/utils'

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
  const [videos, setVideos] = useState<any[]>([])
  const [isLiveData, setIsLiveData] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [whoamiInfo, setWhoamiInfo] = useState<any>(null)
  const [statusInfo, setStatusInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isOnLeaderboard, setIsOnLeaderboard] = useState(false)
  const [isCheckingLeaderboardStatus, setIsCheckingLeaderboardStatus] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/debug/whoami')
        if (response.ok) {
          const data = await response.json()
                  if (data.ok && data.data?.data?.user) {
          console.log('AuthenticatedViewsCard - User data:', data.data.data.user) // Debug log
          setUserInfo(data.data.data.user)
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
        setVideos(vids);
        setVideoCount(vids.length);
        setTotalViews(Number(data?.total_views ?? 0));
        setIsLiveData(true);
        
        if (vids.length === 0) {
          // Don't set error message for valid response with 0 videos
          // Only fetch diagnostic info if there's an actual error
        }
      } catch (e: any) {
        setVideoCount(0);
        setTotalViews(0);
        setErrorMessage(e.message || String(e));
        
        // Fetch diagnostic info when there's an actual error
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
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth()
    loadVideos()
  }, [])

  // Check if user is on leaderboard
  const checkLeaderboardStatus = useCallback(async () => {
    if (!userInfo?.username) return
    
    setIsCheckingLeaderboardStatus(true)
    try {
      const response = await fetch('/api/leaderboard/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userInfo.username })
      })
      
      const data = await response.json()
      if (data.ok) {
        setIsOnLeaderboard(data.onLeaderboard)
      }
    } catch (error) {
      console.error('Error checking leaderboard status:', error)
    } finally {
      setIsCheckingLeaderboardStatus(false)
    }
  }, [userInfo?.username])

  // Remove from leaderboard
  const removeFromLeaderboard = async () => {
    if (!userInfo?.username) return
    
    try {
      const response = await fetch('/api/leaderboard/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userInfo.username })
      })
      
      const data = await response.json()
      if (data.ok) {
        setIsOnLeaderboard(false)
        setToast({
          message: 'Successfully removed from leaderboard!',
          type: 'success',
          isVisible: true
        })
        // Refresh the page after 2 seconds to show updated leaderboard
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setToast({
          message: `Unable to remove from leaderboard: ${data.error}`,
          type: 'error',
          isVisible: true
        })
      }
    } catch (error) {
      console.error('Error removing from leaderboard:', error)
      setToast({
        message: 'Failed to remove from leaderboard. Please try again.',
        type: 'error',
        isVisible: true
      })
    }
  }

  // Check leaderboard status when user info changes
  useEffect(() => {
    if (userInfo?.username) {
      checkLeaderboardStatus()
    }
  }, [userInfo?.username, checkLeaderboardStatus])

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

  // Submit or update score on the leaderboard
  const submitToLeaderboard = async () => {
    try {
      const submissionData = {
        username: userInfo?.username || deriveUsernameFromVideos(videos) || 'unknown',
        totalViews: totalViews,
        displayName: userInfo?.display_name || deriveUsernameFromVideos(videos) || 'User',
        avatarUrl: userInfo?.avatar_url
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting to leaderboard:', submissionData)
      }

      const response = await fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      const data = await response.json()
      if (data.ok) {
        const message = data.rank 
          ? `Congratulations! You're now ranked #${data.rank.rank} on the leaderboard!`
          : 'Score submitted successfully!'

        setToast({
          message: message,
          type: 'success',
          isVisible: true
        })
        setIsOnLeaderboard(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setToast({
          message: `Unable to submit to leaderboard: ${data.error}`,
          type: 'error',
          isVisible: true
        })
      }
    } catch (error) {
      console.error('Error submitting to leaderboard:', error)
      setToast({
        message: 'Failed to submit to leaderboard. Please try again.',
        type: 'error',
        isVisible: true
      })
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
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      <div className="card max-w-md w-full">
        <div className="text-center">
        {!isAuthLoading && (userInfo || videos.length > 0) && (
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-tiktok-primary overflow-hidden bg-gray-700 flex items-center justify-center">
              {userInfo?.avatar_url ? (
                <img 
                  src={`/api/avatar?url=${encodeURIComponent(userInfo.avatar_url)}`}
                  alt={userInfo.display_name || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const displayName = userInfo?.display_name || deriveUsernameFromVideos(videos) || 'U';
                      parent.innerHTML = `<div class="text-white font-bold text-lg">${displayName.charAt(0)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="text-white font-bold text-lg">
                  {(userInfo?.display_name || deriveUsernameFromVideos(videos) || 'U').charAt(0)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {userInfo?.display_name || deriveUsernameFromVideos(videos) || 'User'}
            </div>
          </div>
        )}
        
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
          <div className="text-gray-400 text-sm mb-4">
            This TikTok account currently has no public videos.
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

        {/* Enhanced diagnostic hints only for actual errors */}
        {errorMessage && debugInfo && debugInfo.count === 0 && (
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
        
        {!isAuthLoading && (userInfo || videos.length > 0) && (
          <div className="mt-4 space-y-3">
            {!isOnLeaderboard ? (
              <button
                onClick={submitToLeaderboard}
                className="btn-primary w-full block"
                disabled={totalViews === 0}
              >
                {totalViews === 0 ? 'Submit to Leaderboard' : 'Submit/Update Leaderboard Score'}
              </button>
            ) : (
              <>
                <button
                  onClick={submitToLeaderboard}
                  className="btn-primary w-full block"
                  disabled={totalViews === 0}
                >
                  {totalViews === 0 ? 'Update Leaderboard Score' : 'Update Leaderboard Score'}
                </button>
                <button
                  onClick={removeFromLeaderboard}
                  className="btn-secondary w-full block"
                  disabled={isCheckingLeaderboardStatus}
                >
                  {isCheckingLeaderboardStatus ? 'Checking...' : 'Remove from Leaderboard'}
                </button>
              </>
            )}
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
    </>
  )
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    // If profile scope is missing, route to re-consent page
    if (cookieHas('needs_profile_scope=1')) {
      window.location.href = '/grant/profile';
      return;
    }

    async function checkAuth() {
      try {
        const response = await fetch('/api/debug/whoami')
        if (response.ok) {
          const data = await response.json()
          console.log('Home - Whoami API response:', data) // Debug log
          if (data.ok && data.data?.data?.user) {
            console.log('User data structure:', data.data.data.user) // Debug the actual user data
            setUserInfo(data.data.data.user)
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
            
            {!isAuthLoading && !userInfo && (
              <>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
                  Connect your account to see the sum of views across all your videos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
                  <LoginButton />
                  <span className="text-gray-400 text-sm">
                    Free • EU data storage • Secure OAuth
                  </span>
                </div>
              </>
            )}
            
            {!isAuthLoading && userInfo && (
              <div className="flex justify-center mt-12 animate-slide-up">
                <AuthenticatedViewsCard />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data Section - Only for non-authenticated users */}
      {!isAuthLoading && !userInfo && (
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
              <ViewsCard />
            </div>
          </div>
        </section>
      )}

      {/* Leaderboard Section */}
      <section className="py-16 bg-tiktok-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Leaderboard currentUser={userInfo} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  )
}
