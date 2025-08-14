import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL
  const scopes = process.env.NEXT_PUBLIC_TIKTOK_SCOPES

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

  // Construct TikTok OAuth URL
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${encodeURIComponent(scopes || 'user.info.basic,video.list')}&redirect_uri=${encodeURIComponent(baseUrl + '/auth/callback')}&state=${Math.random().toString(36).substring(7)}`
  
  // Redirect to TikTok OAuth
  redirect(authUrl)
}
