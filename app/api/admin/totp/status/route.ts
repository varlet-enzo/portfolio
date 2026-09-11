import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totpConfigured: !!process.env.TOTP_SECRET,
    secretLength: process.env.TOTP_SECRET?.length ?? 0,
  });
}
