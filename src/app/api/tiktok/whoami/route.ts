// app/api/tiktok/whoami/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('tt_access')?.value;
    if (!token) return NextResponse.json({ ok:false, error:'Missing tt_access cookie' }, { status:400 });

    const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url';
    const resp = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}`, Accept: 'application/json' },
    });
    const json = await resp.json().catch(() => ({}));
    return NextResponse.json({ ok: resp.ok, status: resp.status, raw: json });
  } catch (e:any) { return NextResponse.json({ ok:false, error:String(e) }, { status:500 }); }
}
