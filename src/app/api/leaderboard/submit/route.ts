import { NextResponse } from "next/server";
import { submitScore, throttleSubmit } from "@/lib/leaderboard";

function kvReady() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

export async function POST(req: Request) {
  if (!kvReady()) {
    console.warn("[leaderboard] KV not configured");
    return NextResponse.json({ ok: false, error: "storage unavailable" }, { status: 503 });
  }
  try {
    const { username, totalViews, displayName, avatarUrl } = await req.json();
    if (!(await throttleSubmit(username))) {
      return NextResponse.json({ ok: false, error: "too many submits" }, { status: 429 });
    }
    const rank = await submitScore(username, Number(totalViews), { displayName, avatarUrl });
   return NextResponse.json({ ok: true, rank });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "submit error" }, { status: 400 });
  }
}
