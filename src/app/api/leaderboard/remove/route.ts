import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const ZSET_KEY = "tv:leaderboard:zset";
const USER_KEY = (u: string) => `tv:user:${u}`;

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
    
    await kv.zrem(ZSET_KEY, username);
    await kv.del(USER_KEY(username));
    
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[leaderboard] Remove error:", e);
    return NextResponse.json({ ok: false, error: e.message ?? "delete error" }, { status: 400 });
  }
}
