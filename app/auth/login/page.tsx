'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    // Check if environment variables are available
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
    const scopes = process.env.NEXT_PUBLIC_TIKTOK_SCOPES;

    if (appBaseUrl && clientKey && scopes) {
      setHasConfig(true);
      const redirectUri = `${appBaseUrl}/auth/callback`;
      const state = Math.random().toString(36).substring(7);
      
      const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
      url.searchParams.set('client_key', clientKey);
      url.searchParams.set('scope', scopes);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('state', state);
      
      setAuthUrl(url.toString());
    } else {
      setHasConfig(false);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe2c55] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="card text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Configuration Required
              </h1>
              <p className="text-gray-600 mb-6">
                TikTok OAuth is not configured. Please set up the required environment variables.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">Required environment variables:</p>
              <code className="text-xs text-gray-600 block">
                NEXT_PUBLIC_APP_BASE_URL<br/>
                NEXT_PUBLIC_TIKTOK_CLIENT_KEY<br/>
                NEXT_PUBLIC_TIKTOK_SCOPES
              </code>
            </div>
            
            <Link href="/" className="btn-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your TikTok Account
            </h1>
            <p className="text-gray-600">
              Click below to securely connect your TikTok account and view your total views.
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href={authUrl}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>🎵</span>
              <span>Login with TikTok</span>
            </a>
            
            <Link href="/" className="btn-secondary w-full">
              Cancel
            </Link>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>By connecting, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
