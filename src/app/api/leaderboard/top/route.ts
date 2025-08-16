import { NextResponse } from "next/server";
import { getTop } from "@/lib/leaderboard";

function kvReady() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

export async function GET(req: Request) {
  if (!kvReady()) {
    console.warn("[leaderboard] KV not configured");
    return NextResponse.json({ ok: false, rows: [] }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 50);
  const offset = Number(searchParams.get("offset") ?? 0);
  const rows = await getTop(limit, offset);
  return NextResponse.json({ ok: true, rows });
}
