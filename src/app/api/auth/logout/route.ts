import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('tt_access', '', { maxAge: 0, path: '/' })
  res.cookies.set('tt_open_id', '', { maxAge: 0, path: '/' })
  return res
}
