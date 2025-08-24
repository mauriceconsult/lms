// app/api/about/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const about = await db.about.findFirst();
    return NextResponse.json(
      about || {
        content:
          "Welcome to eduPlat! This page provides information about setting up your admin account. Admins manage courses and define educational visions. Edit this content to customize it for your users.",
      }
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} GET /api/about] Error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch About content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    if (typeof content !== "string" || content.length === 0) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const about = await db.about.upsert({
      where: { id: "default-about-id" },
      update: { content, updatedAt: new Date(), updatedBy: userId },
      create: { id: "default-about-id", content, updatedBy: userId },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} POST /api/about] Error:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to update About content" },
      { status: 500 }
    );
  }
}
