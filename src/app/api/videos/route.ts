import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const defaultFields: string[] = [
  'id',
  'title',
  'create_time',
  'duration',
  'cover_image_url',
  'share_url',
  // some implementations require dotted subfields for statistics:
  'statistics.view_count'
]

export async function POST(request: NextRequest) {
  try {
    const cookieAccess = cookies().get('tt_access')?.value
    const bodyIn = await request.json().catch(() => ({} as any))

    const access_token: string | undefined =
      bodyIn.access_token ?? cookieAccess
    const cursor = Number(bodyIn.cursor ?? 0) || 0
    const max_count = Number(bodyIn.max_count ?? 20) || 20

    // normalize fields
    const fields: string[] =
      Array.isArray(bodyIn.fields) && bodyIn.fields.length
        ? bodyIn.fields
        : defaultFields

    if (!access_token) {
      return NextResponse.json(
        { error: 'Missing access_token (cookie or body)' },
        { status: 400 }
      )
    }

    // build payload – include CSV fallback just in case
    const payload = {
      cursor,
      max_count,
      fields,
      fields_csv: fields.join(','), // harmless fallback
    }

    // TEMP LOGS (visible in Vercel logs)
    console.log('[videos] Request payload to TikTok:', payload)

    const resp = await fetch('https://open.tiktokapis.com/v2/video/list/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(access_token)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      console.error('[videos] TikTok error:', json)
      return NextResponse.json(
        { error: 'tiktok.video.list', details: json },
        { status: resp.status }
      )
    }

    return NextResponse.json(json)
  } catch (e: any) {
    console.error('[videos] Server error:', e)
    return NextResponse.json({ error: 'Server error', details: String(e) }, { status: 500 })
  }
}
