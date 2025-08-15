import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, this would be a database
let leaderboardData: Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}> = []

export async function GET() {
  try {
    // Sort by total views descending and return top 50
    const sortedData = [...leaderboardData]
      .sort((a, b) => b.total_views - a.total_views)
      .slice(0, 50)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

    return NextResponse.json({
      success: true,
      data: sortedData,
      total_entries: leaderboardData.length
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, display_name, total_views, video_count, avatar_url } = body

    // Validate required fields
    if (!username || !display_name || typeof total_views !== 'number' || typeof video_count !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists in leaderboard
    const existingIndex = leaderboardData.findIndex(entry => entry.username === username)
    
    if (existingIndex !== -1) {
      // Update existing entry if new total is higher
      if (total_views > leaderboardData[existingIndex].total_views) {
        leaderboardData[existingIndex] = {
          username,
          display_name,
          total_views,
          video_count,
          avatar_url,
          submitted_at: new Date().toISOString()
        }
      }
    } else {
      // Add new entry
      leaderboardData.push({
        username,
        display_name,
        total_views,
        video_count,
        avatar_url,
        submitted_at: new Date().toISOString()
      })
    }

    // Sort leaderboard by total views
    leaderboardData.sort((a, b) => b.total_views - a.total_views)

    return NextResponse.json({
      success: true,
      message: 'Leaderboard updated successfully',
      user_rank: leaderboardData.findIndex(entry => entry.username === username) + 1
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update leaderboard' },
      { status: 500 }
    )
  }
}
