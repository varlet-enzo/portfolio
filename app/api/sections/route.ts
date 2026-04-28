import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const bundledPath = path.join(process.cwd(), "content", "sections.json");
const tmpPath = "/tmp/portfolio-sections.json";

async function readSections(): Promise<string> {
  try {
    await fs.access(tmpPath);
    return await fs.readFile(tmpPath, "utf-8");
  } catch {
    return await fs.readFile(bundledPath, "utf-8");
  }
}

async function writeSections(content: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    const apiUrl =
      "https://api.github.com/repos/varlet-enzo/portfolio/contents/content/sections.json";

    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!getRes.ok) throw new Error("GitHub API: impossible de lire le fichier");
    const { sha } = await getRes.json() as { sha: string };

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "admin: update sections.json",
        content: Buffer.from(content).toString("base64"),
        sha,
        branch: "main",
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json() as { message?: string };
      throw new Error(err.message ?? "GitHub API error");
    }

    // Also cache locally so GET reflects changes before next deploy
    await fs.writeFile(tmpPath, content, "utf-8").catch(() => {});
    return;
  }

  // Dev fallback: write to local filesystem
  try {
    await fs.writeFile(bundledPath, content, "utf-8");
  } catch {
    // Vercel fallback: /tmp (ephemeral but prevents crash)
    await fs.writeFile(tmpPath, content, "utf-8");
  }
}

export async function GET() {
  try {
    const data = await readSections();
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
    await writeSections(JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
