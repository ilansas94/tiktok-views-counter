'use client';
import { useEffect, useState } from 'react';
import { buildTikTokLoginURL } from '@/lib/tiktokLogin';

export default function GrantProfile() {
  const [href, setHref] = useState('');
  
  useEffect(() => {
    setHref(buildTikTokLoginURL(window.location.origin, 'profile-consent'));
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-tiktok-dark">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-3">Allow Profile Access</h1>
            
            <p className="text-gray-400 mb-6">
              To show your avatar and display name, please allow &quot;Access your profile info&quot; on TikTok.
            </p>
            
            <a 
              className="btn-primary w-full block mb-4" 
              href={href}
            >
              Continue on TikTok
            </a>
            
            <p className="text-xs text-gray-500">
              If your account settings prevent this, we&apos;ll still show your totals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
