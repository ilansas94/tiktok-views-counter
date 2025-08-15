'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}

interface LeaderboardProps {
  currentUser?: {
    username: string
    display_name: string
    avatar_url?: string
  } | null
}

export function Leaderboard({ currentUser }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      
      if (data.success) {
        setLeaderboardData(data.data)
      } else {
        setError(data.error || 'Failed to fetch leaderboard')
      }
    } catch (err) {
      setError('Failed to load leaderboard')
      console.error('Error fetching leaderboard:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toLocaleString()
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  if (isLoading) {
    return (
      <div className="card max-w-4xl w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card max-w-4xl w-full">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-4xl w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Top Creators</h2>
        <p className="text-gray-400">See who has the most total views across all their videos</p>
      </div>

             {leaderboardData.length === 0 ? (
         <div className="text-center py-12">
           <div className="text-6xl mb-4">📊</div>
           <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
           <p className="text-gray-400 mb-4">
             {currentUser 
               ? "Be the first to submit your total views!" 
               : "Be the first to submit your total views!"
             }
           </p>
           {currentUser ? (
             <div className="text-sm text-gray-400 mb-4">
                               You&apos;re logged in as {currentUser.display_name} - submit your views above!
             </div>
           ) : (
             <Link href="/auth/login" className="btn-primary">
               Login & Submit Your Views
             </Link>
           )}
         </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div 
              key={entry.username}
              className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-tiktok-primary/30 transition-colors"
            >
              {/* Rank */}
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <span className="text-lg font-bold">
                  {getRankIcon(entry.rank)}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full border-2 border-tiktok-primary overflow-hidden bg-gray-700 flex items-center justify-center mr-4">
                {entry.avatar_url ? (
                  <img 
                    src={`/api/avatar?url=${encodeURIComponent(entry.avatar_url)}`}
                    alt={entry.display_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-white font-bold text-lg">${entry.display_name?.charAt(0) || 'U'}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="text-white font-bold text-lg">
                    {entry.display_name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="font-semibold text-white">{entry.display_name}</div>
                <div className="text-sm text-gray-400">@{entry.username}</div>
                <div className="text-xs text-gray-500">
                  {entry.video_count} video{entry.video_count !== 1 ? 's' : ''} • 
                  Submitted {new Date(entry.submitted_at).toLocaleDateString()}
                </div>
              </div>

              {/* Views */}
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">
                  {formatViews(entry.total_views)}
                </div>
                <div className="text-sm text-gray-400">total views</div>
              </div>
            </div>
          ))}
        </div>
      )}

             <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
         {currentUser ? (
           <p className="text-sm text-gray-400 mb-4">
                           You&apos;re logged in as {currentUser.display_name} - submit your views above to join the leaderboard!
           </p>
         ) : (
           <>
             <p className="text-sm text-gray-400 mb-4">
               Want to see your ranking? Login and submit your total views!
             </p>
             <Link href="/auth/login" className="btn-primary">
               Join the Leaderboard
             </Link>
           </>
         )}
       </div>
    </div>
  )
}
