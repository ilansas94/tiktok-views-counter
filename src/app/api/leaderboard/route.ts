import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for persistent storage
const LEADERBOARD_FILE = path.join(process.cwd(), 'data', 'leaderboard.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(LEADERBOARD_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load leaderboard data from file
async function loadLeaderboardData(): Promise<Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}>> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return []
  }
}

// Save leaderboard data to file
async function saveLeaderboardData(data: Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}>) {
  await ensureDataDirectory()
  await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(data, null, 2))
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
    const body = await request.json()
    const { username, display_name, total_views, video_count, avatar_url } = body

    // Validate required fields
    if (!username || !display_name || typeof total_views !== 'number' || typeof video_count !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load current leaderboard data
    const leaderboardData = await loadLeaderboardData()

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

    // Save updated data to file
    await saveLeaderboardData(leaderboardData)

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
