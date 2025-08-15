import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for persistent storage
// Use /tmp directory for Vercel compatibility
const LEADERBOARD_FILE = process.env.VERCEL 
  ? '/tmp/leaderboard.json'
  : path.join(process.cwd(), 'data', 'leaderboard.json')

// Fallback in-memory storage for when file operations fail
let fallbackLeaderboardData: Array<{
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}> = []

// Ensure data directory exists
async function ensureDataDirectory() {
  if (process.env.VERCEL) {
    // Vercel doesn't need directory creation for /tmp
    return
  }
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
    console.log('Loading leaderboard data from:', LEADERBOARD_FILE)
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    console.log('Leaderboard data loaded successfully, entries:', parsed.length)
    return parsed
  } catch (error) {
    console.log('File loading failed, using fallback in-memory data:', error instanceof Error ? error.message : String(error))
    // If file doesn't exist or is invalid, return fallback data
    return fallbackLeaderboardData
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
  try {
    await ensureDataDirectory()
    console.log('Saving leaderboard data to:', LEADERBOARD_FILE)
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(data, null, 2))
    console.log('Leaderboard data saved successfully')
    // Also update fallback data
    fallbackLeaderboardData = [...data]
  } catch (error) {
    console.error('File saving failed, using fallback in-memory storage:', error instanceof Error ? error.message : String(error))
    // Update fallback data if file operations fail
    fallbackLeaderboardData = [...data]
    // Don't throw error, just log it
  }
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
    const { username, display_name, total_views, video_count, avatar_url } = body
    console.log('Request data:', { username, display_name, total_views, video_count })

    // Validate required fields
    if (!username || !display_name || typeof total_views !== 'number' || typeof video_count !== 'number') {
      console.log('Validation failed:', { username, display_name, total_views, video_count })
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load current leaderboard data
    console.log('Loading current leaderboard data...')
    const leaderboardData = await loadLeaderboardData()
    console.log('Current leaderboard entries:', leaderboardData.length)

    // Check if user already exists in leaderboard
    const existingIndex = leaderboardData.findIndex(entry => entry.username === username)
    console.log('Existing user index:', existingIndex)
    
    if (existingIndex !== -1) {
      // Update existing entry if new total is higher
      if (total_views > leaderboardData[existingIndex].total_views) {
        console.log('Updating existing user with higher score')
        leaderboardData[existingIndex] = {
          username,
          display_name,
          total_views,
          video_count,
          avatar_url,
          submitted_at: new Date().toISOString()
        }
      } else {
        console.log('User score not higher, keeping existing')
      }
    } else {
      // Add new entry
      console.log('Adding new user to leaderboard')
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
    console.log('Leaderboard sorted, total entries:', leaderboardData.length)

    // Save updated data to file
    console.log('Saving updated leaderboard data...')
    await saveLeaderboardData(leaderboardData)

    const userRank = leaderboardData.findIndex(entry => entry.username === username) + 1
    console.log('User rank calculated:', userRank)

    return NextResponse.json({
      success: true,
      message: 'Leaderboard updated successfully',
      user_rank: userRank
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { success: false, error: `Failed to update leaderboard: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
