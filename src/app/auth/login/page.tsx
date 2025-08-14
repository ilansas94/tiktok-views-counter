'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [isConfigValid, setIsConfigValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if environment variables are available
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/auth/config')
        const data = await response.json()
        setIsConfigValid(data.isValid)
      } catch (error) {
        setIsConfigValid(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConfig()
  }, [])

  const handleLogin = () => {
    if (isConfigValid) {
      // Redirect to TikTok OAuth
      const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`
      const scopes = process.env.NEXT_PUBLIC_TIKTOK_SCOPES || 'user.info.basic,video.list'
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&scope=${scopes}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${Math.random().toString(36).substring(7)}`
      
      window.location.href = authUrl
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
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
              Connect Your TikTok Account
            </h1>
            
            <p className="text-gray-400 mb-8">
              Securely log in to see your total views across all videos
            </p>

            {isConfigValid ? (
              <button
                onClick={handleLogin}
                className="btn-primary w-full mb-4"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Login with TikTok
              </button>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-400 text-sm font-medium">
                    OAuth not configured
                  </span>
                </div>
                <p className="text-yellow-300 text-xs mt-2">
                  TikTok OAuth credentials are not set up. This is expected during development.
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <p>• We only request basic profile and video list access</p>
              <p>• No data is stored on our servers</p>
              <p>• You can revoke access anytime</p>
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
