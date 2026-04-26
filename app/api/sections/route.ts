import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const sectionsPath = path.join(process.cwd(), "content", "sections.json");

export async function GET() {
  try {
    const data = await fs.readFile(sectionsPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to read sections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const password = request.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    await fs.writeFile(sectionsPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write sections" }, { status: 500 });
  }
}
