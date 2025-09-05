export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  const raw = process.env.ENABLE_PER_VIDEO || '0'
  const enabled = String(raw).trim() === '1'
  return NextResponse.json({ enabled, source: 'env', raw })
}

