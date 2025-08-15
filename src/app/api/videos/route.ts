// Docs: /v2/video/list (?fields=...) and /v2/video/query (?fields=... view_count/like_count/etc.)
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const videoListFields = ['id','title','create_time','duration','cover_image_url','share_url'];
const videoStatsFields = ['id','view_count','like_count','comment_count','share_count'];

function sumViews(videos: any[]) {
  return videos.reduce((s, v) => s + (v?.statistics?.view_count ?? 0), 0);
}

export async function POST(request: NextRequest) {
  try {
    const cookieAccess = cookies().get('tt_access')?.value;
    const body = await request.json().catch(() => ({} as any));
    const access_token: string | undefined = body.access_token ?? cookieAccess;
    const cursor = Number(body.cursor ?? 0) || 0;
    const max_count = Number(body.max_count ?? 20) || 20;

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token (cookie or body)' }, { status: 400 });
    }

    // ---- Step 1: list videos (NO filters) ----
    const listParams = new URLSearchParams({ fields: videoListFields.join(',') });
    const listUrl = `https://open.tiktokapis.com/v2/video/list/?${listParams.toString()}`;

    const listResp = await fetch(listUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(access_token)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ cursor, max_count }), // <-- no filters here
    });

    const listJson = await listResp.json().catch(() => ({}));
    if (!listResp.ok) {
      return NextResponse.json(
        { error: 'tiktok.video.list', details: listJson },
        { status: listResp.status }
      );
    }

    const videos = Array.isArray(listJson?.data?.videos) ? listJson.data.videos : [];
    const videoIds = videos.map((v: any) => v.id);
    let videosWithStats = videos;

    // ---- Step 2: stats ----
    if (videoIds.length > 0) {
      const statsParams = new URLSearchParams({ fields: videoStatsFields.join(',') });
      const statsUrl = `https://open.tiktokapis.com/v2/video/query/?${statsParams.toString()}`;

      const statsResp = await fetch(statsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${decodeURIComponent(access_token)}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ filters: { video_ids: videoIds } }),
      });

      const statsJson = await statsResp.json().catch(() => ({}));
      if (!statsResp.ok) {
        return NextResponse.json(
          { error: 'tiktok.video.query', details: statsJson },
          { status: statsResp.status }
        );
      }

      const statsMap = new Map<string, any>();
      for (const v of statsJson?.data?.videos ?? []) {
        statsMap.set(v.id, {
          view_count: v.view_count ?? 0,
          like_count: v.like_count ?? 0,
          comment_count: v.comment_count ?? 0,
          share_count: v.share_count ?? 0,
        });
      }

      videosWithStats = videos.map((video: any) => ({
        ...video,
        statistics: statsMap.get(video.id) ?? {
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
        },
      }));
    }

    return NextResponse.json({
      cursor: listJson.data?.cursor ?? 0,
      has_more: !!listJson.data?.has_more,
      total_views: sumViews(videosWithStats),
      videos: videosWithStats,
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', details: String(e) }, { status: 500 });
  }
}
