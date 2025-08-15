import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Step 1: Fields for video list (no statistics)
const videoListFields = [
  'id',
  'title',
  'create_time',
  'duration',
  'cover_image_url',
  'share_url',
]

// Step 2: Fields for video statistics
const videoStatsFields = [
  'id',
  'statistics.view_count',
  'statistics.like_count',
  'statistics.comment_count',
  'statistics.share_count',
]

// Helper function to sum view counts from videos
function sumViews(videos: any[]) {
  return videos.reduce((sum, v) => sum + (v?.statistics?.view_count ?? 0), 0)
}

export async function POST(request: NextRequest) {
  try {
    const cookieAccess = cookies().get('tt_access')?.value
    const body = await request.json().catch(() => ({} as any))

    const access_token: string | undefined = body.access_token ?? cookieAccess
    const cursor = Number(body.cursor ?? 0) || 0
    const max_count = Number(body.max_count ?? 20) || 20

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token (cookie or body)' }, { status: 400 })
    }

    // Step 1: Get video list (no statistics)
    const listParams = new URLSearchParams({ fields: videoListFields.join(',') })
    const listUrl = `https://open.tiktokapis.com/v2/video/list/?${listParams.toString()}`

    console.log('[videos] Step 1: Fetching video list from:', listUrl)

    const listResp = await fetch(listUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(access_token)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ cursor, max_count }),
    })

    const listJson = await listResp.json().catch(() => ({}))

    if (!listResp.ok) {
      console.error('[videos] Step 1 error:', listJson)
      return NextResponse.json({ error: 'tiktok.video.list', details: listJson }, { status: listResp.status })
    }

    console.log('[videos] Step 1 success, videos found:', listJson.data?.videos?.length || 0)

    // Extract video IDs for statistics fetch
    const videoIds = listJson.data?.videos?.map((v: any) => v.id) || []

    let videosWithStats = listJson.data?.videos || []

    // Step 2: Fetch statistics if we have videos
    if (videoIds.length > 0) {
      const statsParams = new URLSearchParams({ fields: videoStatsFields.join(',') })
      const statsUrl = `https://open.tiktokapis.com/v2/video/query/?${statsParams.toString()}`

      console.log('[videos] Step 2: Fetching statistics for', videoIds.length, 'videos from:', statsUrl)

      const statsResp = await fetch(statsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${decodeURIComponent(access_token)}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ filters: { video_ids: videoIds } }),
      })

      const statsJson = await statsResp.json().catch(() => ({}))

      if (!statsResp.ok) {
        console.error('[videos] Step 2 error:', statsJson)
        return NextResponse.json({ error: 'tiktok.video.query', details: statsJson }, { status: statsResp.status })
      }

      console.log('[videos] Step 2 success, stats found for:', statsJson.data?.videos?.length || 0, 'videos')

      // Merge statistics back onto the original videos
      const statsMap = new Map()
      statsJson.data?.videos?.forEach((v: any) => {
        statsMap.set(v.id, v.statistics)
      })

      videosWithStats = videosWithStats.map((video: any) => ({
        ...video,
        statistics: statsMap.get(video.id) || { view_count: 0, like_count: 0, comment_count: 0, share_count: 0 }
      }))
    }

    // Calculate total views
    const totalViews = sumViews(videosWithStats)

    // Return merged result
    const result = {
      cursor: listJson.data?.cursor,
      has_more: listJson.data?.has_more,
      total_views: totalViews,
      videos: videosWithStats
    }

    console.log('[videos] Final result:', { 
      videoCount: videosWithStats.length, 
      totalViews, 
      hasMore: listJson.data?.has_more 
    })

    return NextResponse.json(result)
  } catch (e: any) {
    console.error('[videos] Server error:', e)
    return NextResponse.json({ error: 'Server error', details: String(e) }, { status: 500 })
  }
}
