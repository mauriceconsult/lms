import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ facultyId: string }> }) {
  try {
    const { title, isPublished, userId, description } = await req.json();
    if (!title || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const coursework = await db.coursework.create({
      data: {
        facultyId: (await params).facultyId,
        title,
        description,
        isPublished,
        userId,
      },
    });

    return NextResponse.json(coursework);
  } catch (error) {
    console.error("Failed to create coursework:", error);
    return NextResponse.json({ error: "Failed to create coursework" }, { status: 500 });
  }
};
