// Docs: /v2/video/list (?fields=...) and /v2/video/query (?fields=... view_count/like_count/etc.)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const FULL_FIELDS = ['id','title','create_time','duration','cover_image_url','share_url'];
const MIN_FIELDS = ['id','share_url'];
const STATS_FIELDS = ['id','view_count','like_count','comment_count','share_count'];

async function tiktokList(token: string, fields: string[], cursor=0, max_count=20) {
  const params = new URLSearchParams({ fields: fields.join(',') });
  const url = `https://open.tiktokapis.com/v2/video/list/?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${decodeURIComponent(token)}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ cursor, max_count }),
  });
  const json = await resp.json().catch(() => ({}));
  return { ok: resp.ok, status: resp.status, json };
}

// ---- Move the existing POST body into this function ----
async function handle(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieAccess = cookies().get('tt_access')?.value;
    const body = await request.json().catch(() => ({} as any));
    const access = body.access_token ?? cookieAccess;
    const cursor = Number(body.cursor ?? 0) || 0;
    const max_count = Number(body.max_count ?? 20) || 20;
    if (!access) return NextResponse.json({ error:'Missing access_token' }, { status:400 });

    // 1) Try full fields
    let mode:'full'|'minimal' = 'full';
    let list = await tiktokList(access, FULL_FIELDS, cursor, max_count);
    if (!list.ok) return NextResponse.json({ error:'tiktok.video.list', details:list.json }, { status:list.status });

    let videos = Array.isArray(list.json?.data?.videos) ? list.json.data.videos : [];

    // 2) Auto-fallback to minimal fields if zero
    if (videos.length === 0) {
      const minList = await tiktokList(access, MIN_FIELDS, cursor, max_count);
      if (minList.ok) {
        const minVideos = Array.isArray(minList.json?.data?.videos) ? minList.json.data.videos : [];
        if (minVideos.length > 0) {
          mode = 'minimal';
          list = minList;
          videos = minVideos;
        }
      }
    }

    // 3) Stats fetch if any videos
    let withStats = videos;
    if (videos.length > 0) {
      const ids = videos.map((v:any)=>v.id);
      const statsParams = new URLSearchParams({ fields: STATS_FIELDS.join(',') });
      const statsUrl = `https://open.tiktokapis.com/v2/video/query/?${statsParams.toString()}`;
      const statsResp = await fetch(statsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${decodeURIComponent(access)}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ filters: { video_ids: ids } }),
      });
      const statsJson = await statsResp.json().catch(()=>({}));
      if (!statsResp.ok) {
        return NextResponse.json({ error:'tiktok.video.query', details:statsJson }, { status:statsResp.status });
      }
      const m = new Map<string, any>();
      for (const v of statsJson?.data?.videos ?? []) {
        m.set(v.id, {
          view_count: v.view_count ?? 0,
          like_count: v.like_count ?? 0,
          comment_count: v.comment_count ?? 0,
          share_count: v.share_count ?? 0,
        });
      }
      withStats = videos.map((v:any)=>({ ...v, statistics: m.get(v.id) ?? { view_count:0, like_count:0, comment_count:0, share_count:0 } }));
    }

    const total = withStats.reduce((s:any,v:any)=> s + (v?.statistics?.view_count ?? 0), 0);

    return NextResponse.json({
      cursor: list.json?.data?.cursor ?? 0,
      has_more: !!list.json?.data?.has_more,
      list_mode: mode,
      fieldset_used: mode === 'full' ? FULL_FIELDS : MIN_FIELDS,
      total_views: total,
      videos: withStats,
    });
  } catch (e:any) {
    return NextResponse.json({ error:'Server error', details:String(e) }, { status:500 });
  }
}

// Keep POST
export async function POST(request: NextRequest) {
  return handle(request);
}

// New: GET for easy manual testing in the browser
export async function GET(request: NextRequest) {
  return handle(request);
}
