import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { CVData, generateCVHtml } from "@/lib/cv-generator";

const dataPath = path.join(process.cwd(), "content", "cv-data.json");

const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OWNER = "varlet-enzo";
const GH_REPO = "portfolio";
const GH_BRANCH = "main";

async function ghGet(filePath: string) {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}?ref=${GH_BRANCH}`,
    { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function ghPut(filePath: string, content: string, message: string) {
  const existing = await ghGet(filePath);
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: GH_BRANCH,
  };
  if (existing?.sha) body.sha = existing.sha;
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
}

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
  if (!GH_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }
  try {
    const data: CVData = await request.json();
    const jsonContent = JSON.stringify(data, null, 2);
    const htmlContent = generateCVHtml(data);
    await ghPut("content/cv-data.json", jsonContent, "chore: update CV data via admin panel");
    await ghPut("public/cv.html", htmlContent, "chore: regenerate cv.html");
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Failed to save CV: ${msg}` }, { status: 500 });
  }
}
