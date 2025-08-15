import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const defaultFields = [
  'id',
  'title',
  'create_time',
  'duration',
  'cover_image_url',
  'share_url',
  'statistics',
]

export async function POST(request: NextRequest) {
  try {
    const cookieAccess = cookies().get('tt_access')?.value
    const body = await request.json().catch(() => ({} as any))

    const access_token: string | undefined = body.access_token ?? cookieAccess
    const cursor = Number(body.cursor ?? 0) || 0
    const max_count = Number(body.max_count ?? 20) || 20
    const fields: string[] =
      Array.isArray(body.fields) && body.fields.length ? body.fields : defaultFields

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token (cookie or body)' }, { status: 400 })
    }

    // ---> IMPORTANT: fields must be in the QUERY STRING <---
    const params = new URLSearchParams({ fields: fields.join(',') })
    const url = `https://open.tiktokapis.com/v2/video/list/?${params.toString()}`

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(access_token)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ cursor, max_count }), // only pagination in body
    })

    const json = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return NextResponse.json({ error: 'tiktok.video.list', details: json }, { status: resp.status })
    }

    return NextResponse.json(json)
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', details: String(e) }, { status: 500 })
  }
}
