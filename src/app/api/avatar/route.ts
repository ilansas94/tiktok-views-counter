import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

function kvReady() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

function getCacheKey(username?: string | null, url?: string | null) {
  if (username) return `tv:avatar:cache:${username}`;
  if (url) return `tv:avatarurl:cache:${Buffer.from(url).toString('base64')}`;
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const avatarUrl = searchParams.get('url')
  const username = searchParams.get('username')
  
  if (!avatarUrl) {
    return NextResponse.json({ error: 'No avatar URL provided' }, { status: 400 })
  }

  try {
    // Attempt remote fetch first
    const response = await fetch(avatarUrl)
    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      if (!contentType.startsWith('image/')) {
        throw new Error(`Unexpected content type: ${contentType}`)
      }
      const imageBuffer = await response.arrayBuffer()

      // Save to KV cache (best-effort)
      const key = kvReady() ? getCacheKey(username, avatarUrl) : null
      if (key) {
        try {
          await kv.hset(key, {
            data: Buffer.from(imageBuffer).toString('base64'),
            contentType,
            updatedAt: Date.now().toString()
          })
        } catch (e) {
          console.warn('avatar cache write failed', e)
        }
      }

      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
        },
      })
    }

    // If remote fetch fails, attempt to serve cached copy
    throw new Error(`Failed to fetch avatar: ${response.status}`)
  } catch (error) {
    console.warn('Error fetching avatar, attempting cache fallback:', error)
    if (kvReady()) {
      try {
        const key = getCacheKey(searchParams.get('username'), avatarUrl)
        if (key) {
          const cached = await kv.hgetall<Record<string, string>>(key)
          if (cached && cached.data) {
            const buffer = Buffer.from(cached.data, 'base64')
            const contentType = cached.contentType || 'image/jpeg'
            return new NextResponse(buffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=604800',
              },
            })
          }
        }
      } catch (e) {
        console.warn('avatar cache read failed', e)
      }
    }
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 })
  }
}
