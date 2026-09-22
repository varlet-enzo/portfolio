import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const cvPath = path.join(process.cwd(), "public", "cv.html");

export async function GET(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const content = await fs.readFile(cvPath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Failed to read CV" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content } = await request.json();
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }
    await fs.writeFile(cvPath, content, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write CV" }, { status: 500 });
  }
}
