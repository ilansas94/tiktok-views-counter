import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('tt_access')?.value
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 401 })

  const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url'
  const r = await fetch(url, { headers: { Authorization: `Bearer ${decodeURIComponent(token)}` } })
  const j = await r.json()
  return NextResponse.json({ ok: r.ok, status: r.status, data: j })
}
