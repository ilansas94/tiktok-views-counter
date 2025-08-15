import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Define the data structure
interface LeaderboardEntry {
  username: string
  display_name: string
  total_views: number
  video_count: number
  avatar_url?: string
  submitted_at: string
}

// Path to the persistent data file
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'leaderboard.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH)
  console.log('Data directory path:', dataDir)
  try {
    await fs.access(dataDir)
    console.log('Data directory already exists')
  } catch {
    console.log('Creating data directory...')
    await fs.mkdir(dataDir, { recursive: true })
    console.log('Data directory created successfully')
  }
}

// Load leaderboard data from file
async function loadLeaderboardData(): Promise<LeaderboardEntry[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(data)
    console.log(`Loaded ${parsed.length} leaderboard entries from file`)
    return parsed
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log('No existing leaderboard data file found, starting fresh')
    } else {
      console.error('Error loading leaderboard data:', error)
    }
    return []
  }
}

// Save leaderboard data to file
async function saveLeaderboardData(data: LeaderboardEntry[]) {
  try {
    console.log('Attempting to save leaderboard data...')
    await ensureDataDirectory()
    console.log('Writing data to file:', DATA_FILE_PATH)
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
    console.log('Leaderboard data saved, total entries:', data.length)
  } catch (error) {
    console.error('Error saving leaderboard data:', error)
    throw error
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

    // Load current data
    const currentData = await loadLeaderboardData()
    
    // Check if user already exists
    const existingUserIndex = currentData.findIndex(entry => entry.username === username)
    
    if (existingUserIndex !== -1) {
      // Update existing user's data
      console.log(`Updating existing user: ${username}`)
      currentData[existingUserIndex] = {
        ...currentData[existingUserIndex],
        display_name,
        total_views,
        video_count,
        avatar_url,
        submitted_at: new Date().toISOString()
      }
    } else {
      // Add new user
      console.log(`Adding new user: ${username}`)
      const newEntry: LeaderboardEntry = {
        username,
        display_name,
        total_views,
        video_count,
        avatar_url,
        submitted_at: new Date().toISOString()
      }
      currentData.push(newEntry)
    }
    
    // Sort by total views
    currentData.sort((a, b) => b.total_views - a.total_views)
    
    // Save updated data
    await saveLeaderboardData(currentData)

    // Find user rank
    const userRank = currentData.findIndex(entry => entry.username === username) + 1

    return NextResponse.json({
      success: true,
      message: existingUserIndex !== -1 ? 'Leaderboard updated successfully' : 'Added to leaderboard successfully',
      user_rank: userRank,
      is_update: existingUserIndex !== -1
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update leaderboard' },
      { status: 500 }
    )
  }
}
