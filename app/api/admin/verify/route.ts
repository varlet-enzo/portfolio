import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, totpRequired: !!process.env.TOTP_SECRET });
}
