import { NextResponse } from "next/server";
import { isOnLeaderboard } from "@/lib/leaderboard";

function kvReady() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

export async function POST(req: Request) {
  if (!kvReady()) {
    console.warn("[leaderboard] KV not configured");
    return NextResponse.json({ ok: false, error: "storage unavailable" }, { status: 503 });
  }
  
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ ok: false, error: "username required" }, { status: 400 });
    }
    
    const onLeaderboard = await isOnLeaderboard(username);
    return NextResponse.json({ ok: true, onLeaderboard });
  } catch (e: any) {
    console.error("[leaderboard] Status check error:", e);
    return NextResponse.json({ ok: false, error: e.message ?? "status check error" }, { status: 400 });
  }
}
