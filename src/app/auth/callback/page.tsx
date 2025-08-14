'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function CallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      setStatus('error')
      setMessage(errorDescription || 'Authentication failed. Please try again.')
    } else if (code) {
      setStatus('success')
      setMessage('Authentication successful! Your app is pending TikTok review, so we&apos;re showing sample data for now.')
    } else {
      setStatus('error')
      setMessage('Invalid callback. Please try logging in again.')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary"></div>
              )}
              {status === 'success' && (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {status === 'error' && (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              {status === 'loading' && 'Processing...'}
              {status === 'success' && 'Authentication Complete'}
              {status === 'error' && 'Authentication Failed'}
            </h1>
            
            <p className="text-gray-400 mb-6">
              {message}
            </p>

            {status === 'success' && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-400 text-sm font-medium">
                    App Pending Review
                  </span>
                </div>
                <p className="text-blue-300 text-xs mt-2">
                  Once TikTok approves our app, you&apos;ll see your real view counts instead of sample data.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/" className="btn-primary w-full block">
                View Sample Data
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
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
