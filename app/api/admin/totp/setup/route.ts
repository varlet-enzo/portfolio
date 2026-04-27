import { NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.TOTP_SECRET) {
    return NextResponse.json({ error: "TOTP already configured" }, { status: 400 });
  }

  const secret = generateSecret();
  const uri = generateURI({ label: "admin", issuer: "Portfolio Admin", secret });
  const qrDataUrl = await QRCode.toDataURL(uri);

  return NextResponse.json({ secret, qrDataUrl });
}
