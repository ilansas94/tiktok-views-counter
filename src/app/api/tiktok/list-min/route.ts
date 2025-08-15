// app/api/tiktok/list-min/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = cookies().get('tt_access')?.value;
    if (!token) return NextResponse.json({ ok:false, error:'Missing tt_access cookie' }, { status:400 });

    const url = 'https://open.tiktokapis.com/v2/video/list/?fields=id,share_url';
    const body = { cursor: 0, max_count: 20 };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json().catch(() => ({}));
    const videos = Array.isArray(json?.data?.videos) ? json.data.videos : [];
    return NextResponse.json({
      ok: resp.ok,
      status: resp.status,
      sent: { fields: 'id,share_url', body },
      count: videos.length,
      sample_ids: videos.slice(0,5).map((v:any)=>v.id),
      raw: json,
    });
  } catch (e:any) { return NextResponse.json({ ok:false, error:String(e) }, { status:500 }); }
}
