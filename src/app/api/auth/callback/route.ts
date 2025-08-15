import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return new Response(
        `<pre>Missing code parameter</pre>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const r = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!
      })
    })

    const data = await r.json()

    if (!r.ok) {
      return new Response(
        `<pre>Token exchange failed:\n${JSON.stringify(data, null, 2)}</pre>`,
        { status: r.status, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const maxAge = (data.expires_in || 3600).toString()
    const response = NextResponse.redirect(new URL('/auth/callback', request.url))
    
    response.cookies.set('tt_access', data.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: parseInt(maxAge)
    })
    
    response.cookies.set('tt_open_id', data.open_id, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: parseInt(maxAge)
    })

    return response
  } catch (e) {
    return new Response(
      `<pre>Callback error:\n${String(e)}</pre>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}
