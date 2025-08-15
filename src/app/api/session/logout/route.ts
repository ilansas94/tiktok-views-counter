// app/api/session/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST() {
  cookies().set('tt_access', '', { path:'/', httpOnly:true, maxAge:0 });
  return NextResponse.json({ ok:true });
}
