import { kv } from "@vercel/kv";

const ZSET_KEY = "tv:leaderboard:zset";             // member=username, score=totalViews
const USER_KEY = (u: string) => `tv:user:${u}`;     // profile hash (displayName, avatarUrl)

export type LeaderboardEntry = {
  username: string;
  totalViews: number;
  displayName?: string;
  avatarUrl?: string;
};

export async function upsertUserProfile(
  username: string,
  profile: Partial<Omit<LeaderboardEntry, "username" | "totalViews">>
) {
  if (!username) return;
  await kv.hset(USER_KEY(username), profile as Record<string, string>);
}

export async function submitScore(
  username: string,
  totalViews: number,
  profile?: { displayName?: string; avatarUrl?: string }
) {
  if (!username) throw new Error("username is required");
  if (Number.isNaN(totalViews)) throw new Error("totalViews must be a number");
  await kv.zadd(ZSET_KEY, { score: totalViews, member: username });
  if (profile) await upsertUserProfile(username, profile);
  return getRank(username);
}

export async function getRank(username: string) {
  const score = await kv.zscore(ZSET_KEY, username);
  if (score === null) return null;
  
  // Get all scores and find rank
  const allScores = await kv.zrange(ZSET_KEY, 0, -1, { withScores: true });
  const sortedScores = [];
  for (let i = 0; i < allScores.length; i += 2) {
    sortedScores.push({
      username: String(allScores[i]),
      score: Number(allScores[i + 1])
    });
  }
  sortedScores.sort((a, b) => b.score - a.score);
  
  const rank = sortedScores.findIndex(entry => entry.username === username);
  return rank === -1 ? null : { rank: rank + 1, totalViews: Number(score) };
}

export async function getTop(limit = 50, offset = 0): Promise<LeaderboardEntry[]> {
  const raw = await kv.zrange(ZSET_KEY, 0, -1, { withScores: true });
  const out: LeaderboardEntry[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const username = String(raw[i]);
    const totalViews = Number(raw[i + 1]);
    const meta = await kv.hgetall(USER_KEY(username)) as Record<string, string> | null;
    out.push({ 
      username, 
      totalViews, 
      displayName: meta?.displayName, 
      avatarUrl: meta?.avatarUrl 
    });
  }
  // Sort by totalViews descending and apply limit/offset
  return out
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(offset, offset + limit);
}

// Optional: very light anti-spam (1 submit / 10s)
export async function throttleSubmit(username: string) {
  const key = `tv:rate:${username}`;
  try {
    await kv.set(key, "1", { ex: 10, nx: true });
    return true;
  } catch {
    return false;
  }
}
