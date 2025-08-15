'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-tiktok-dark/95 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-tiktok-primary to-tiktok-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TV</span>
            </div>
            <span className="text-xl font-bold gradient-text">TikTok Views</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms
            </Link>
            
            {!isLoading && (
              <>
                {userInfo ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={userInfo.avatar_url} 
                        alt={userInfo.display_name}
                        className="w-8 h-8 rounded-full border-2 border-tiktok-primary"
                      />
                      <span className="text-gray-300 text-sm">{userInfo.display_name}</span>
                    </div>
                    <Link href="/api/auth/logout" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Logout
                    </Link>
                  </div>
                ) : (
                  <Link href="/auth/login" className="btn-primary">
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/privacy"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
              
              {!isLoading && (
                <>
                  {userInfo ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2">
                        <img 
                          src={userInfo.avatar_url} 
                          alt={userInfo.display_name}
                          className="w-6 h-6 rounded-full border border-tiktok-primary"
                        />
                        <span className="text-gray-300 text-sm">{userInfo.display_name}</span>
                      </div>
                      <Link
                        href="/api/auth/logout"
                        className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block px-3 py-2 btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
