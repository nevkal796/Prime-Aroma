import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session_v2";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = body.password ?? "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Session-only admin cookie: cleared when the browser is closed.
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}
