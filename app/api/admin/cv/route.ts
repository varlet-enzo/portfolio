import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { CVData, generateCVHtml } from "@/lib/cv-generator";

const dataPath = path.join(process.cwd(), "content", "cv-data.json");
const cvPath = path.join(process.cwd(), "public", "cv.html");

export async function GET(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read CV data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data: CVData = await request.json();
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.writeFile(cvPath, generateCVHtml(data), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
  }
}
