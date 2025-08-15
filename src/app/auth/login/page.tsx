'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
  const scopes = process.env.NEXT_PUBLIC_TIKTOK_SCOPES
  const isDebug = searchParams.get('debug') === 'true'

  useEffect(() => {
    const handleAuth = async () => {
      if (clientKey) {
        try {
          // Generate state parameter - use 'debug' for debugging, random for production
          const state = isDebug ? 'debug' : Math.random().toString(36).substring(7)
          
          // Construct TikTok OAuth URL
          const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/')
          authUrl.searchParams.set('client_key', clientKey)
          authUrl.searchParams.set('response_type', 'code')
          authUrl.searchParams.set('scope', 'user.info.basic,video.list')
          authUrl.searchParams.set('redirect_uri', `${window.location.origin}/api/auth/callback`)
          authUrl.searchParams.set('state', state)
          
          // Redirect to TikTok OAuth
          window.location.href = authUrl.toString()
        } catch (error) {
          console.error('Error generating auth URL:', error)
        }
      }
    }

    handleAuth()
  }, [clientKey, scopes, router, isDebug])

  // If clientKey is missing, render error message
  if (!clientKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-2 text-red-400">
                Server Configuration Missing
              </h1>
              
              <p className="text-gray-400 mb-8">
                Please contact the administrator to configure TikTok OAuth credentials.
              </p>

              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm font-medium">
                    TIKTOK_CLIENT_KEY not configured
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-bold mb-2">
              {isDebug ? 'Debug Mode: Redirecting to TikTok...' : 'Redirecting to TikTok...'}
            </h1>
            <p className="text-gray-400">
              {isDebug 
                ? 'Debug mode enabled. You will see raw JSON response instead of redirect.'
                : 'Please wait while we redirect you to TikTok for authorization.'
              }
            </p>
            {isDebug && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Debug mode: State parameter set to &quot;debug&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
