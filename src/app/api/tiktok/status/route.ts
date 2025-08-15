// app/api/tiktok/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const key = (process.env.NEXT_PUBLIC_TT_CLIENT_KEY || '');
  const masked = key ? `${key.slice(0,3)}***${key.slice(-4)}` : 'unset';
  return NextResponse.json({
    client_key: masked,
    app_mode: process.env.TIKTOK_APP_MODE || 'unknown',
    has_tt_cookie: !!cookies().get('tt_access'),
  });
}
