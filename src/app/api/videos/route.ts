import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const cookie = request.headers.get('cookie') || ''
    const cookieAccess = (cookie.match(/(?:^|;\s*)tt_access=([^;]+)/) || [])[1]
    const { access_token = cookieAccess, cursor = 0, max_count = 20 } = await request.json() || {}

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token (cookie or body)' }, { status: 400 })
    }

    const tiktok = await fetch('https://open.tiktokapis.com/v2/video/list/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decodeURIComponent(access_token)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cursor: Number(cursor) || 0, max_count: Number(max_count) || 20 })
    })

    const payload = await tiktok.json()

    if (!tiktok.ok) {
      return NextResponse.json({ error: 'tiktok.video.list', details: payload }, { status: tiktok.status })
    }

    return NextResponse.json(payload)
  } catch (e) {
    return NextResponse.json({ error: 'Server error', details: String(e) }, { status: 500 })
  }
}
