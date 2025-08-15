import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for leaderboard data
// This will persist for the lifetime of the server process
let leaderboardData: Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}> = []

// Load leaderboard data (just return the in-memory data)
async function loadLeaderboardData(): Promise<Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}>> {
  return leaderboardData
}

// Save leaderboard data (just update the in-memory data)
async function saveLeaderboardData(data: Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}>) {
  leaderboardData = [...data]
  console.log('Leaderboard data updated, total entries:', leaderboardData.length)
}

export async function GET() {
  try {
    const leaderboardData = await loadLeaderboardData()
    
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
    console.log('Leaderboard POST request received')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { username, display_name, total_views, video_count, avatar_url } = body

    // Validate required fields
    if (!username || !display_name || typeof total_views !== 'number' || typeof video_count !== 'number') {
      console.log('Validation failed:', { username, display_name, total_views, video_count })
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add new entry to leaderboard
    const newEntry = {
      username,
      display_name,
      total_views,
      video_count,
      avatar_url,
      submitted_at: new Date().toISOString()
    }

    // Get current data and add new entry
    const currentData = await loadLeaderboardData()
    currentData.push(newEntry)
    
    // Sort by total views
    currentData.sort((a, b) => b.total_views - a.total_views)
    
    // Save updated data
    await saveLeaderboardData(currentData)

    // Find user rank
    const userRank = currentData.findIndex(entry => entry.username === username) + 1

    return NextResponse.json({
      success: true,
      message: 'Leaderboard updated successfully',
      user_rank: userRank
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update leaderboard' },
      { status: 500 }
    )
  }
}
