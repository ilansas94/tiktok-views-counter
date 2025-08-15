// app/api/tiktok/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const listFields = ['id','title','create_time','duration','cover_image_url','share_url'];

export async function GET(req: NextRequest) {
  try {
    const access = cookies().get('tt_access')?.value;
    if (!access) {
      return NextResponse.json({ ok:false, error:'Missing tt_access cookie' }, { status: 400 });
    }

    const params = new URLSearchParams({ fields: listFields.join(',') });
    const url = `https://open.tiktokapis.com/v2/video/list/?${params.toString()}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(access)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ cursor: 0, max_count: 20 }), // no filters
    });

    const json = await resp.json().catch(() => ({}));
    return NextResponse.json({
      ok: resp.ok,
      status: resp.status,
      has_more: json?.data?.has_more ?? null,
      count: Array.isArray(json?.data?.videos) ? json.data.videos.length : null,
      sample_ids: (json?.data?.videos ?? []).slice(0, 5).map((v: any) => v.id),
      raw: json,
    });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e) }, { status: 500 });
  }
}
