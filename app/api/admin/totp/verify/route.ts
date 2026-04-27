import { NextResponse } from "next/server";
import { verifySync } from "otplib";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  const code = request.headers.get("x-totp-code");

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.TOTP_SECRET) {
    return NextResponse.json({ ok: true, totpSkipped: true });
  }

  if (!code) {
    return NextResponse.json({ error: "Code manquant" }, { status: 401 });
  }

  const result = verifySync({ secret: process.env.TOTP_SECRET, token: code });
  if (!result || !result.valid) {
    return NextResponse.json({ error: "Code invalide" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
