'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'An error occurred during authentication.');
    } else if (code) {
      setStatus('success');
      setMessage('Authentication successful! Your authorization code has been received.');
    } else {
      setStatus('error');
      setMessage('No authorization code or error received.');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe2c55] mx-auto mb-4"></div>
          <p className="text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card text-center">
          <div className="mb-6">
            {status === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">❌</span>
              </div>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'success' ? 'Authentication Successful' : 'Authentication Failed'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          </div>
          
          {status === 'success' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
              <p className="text-sm text-blue-800">
                This is Phase 0 of our development. The app is currently awaiting TikTok API approval. 
                Once approved, we&apos;ll implement the token exchange and view calculation features.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Link href="/" className="btn-primary w-full">
              Return Home
            </Link>
            
            {status === 'error' && (
              <Link href="/auth/login" className="btn-secondary w-full">
                Try Again
              </Link>
            )}
          </div>
          
          {status === 'success' && (
            <div className="mt-6 text-xs text-gray-500">
              <p>Your authorization code: <code className="bg-gray-100 px-1 rounded">{searchParams.get('code')?.substring(0, 10)}...</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe2c55] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
