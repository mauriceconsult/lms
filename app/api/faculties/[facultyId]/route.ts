import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ facultyId: string }> }) {
  try {
    const { isPublished } = await req.json();
    if (typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "Invalid isPublished value" }, { status: 400 });
    }

    const faculty = await db.faculty.update({
      where: { id: (await params).facultyId },
      data: { isPublished },
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.error("Failed to update faculty:", error);
    return NextResponse.json({ error: "Failed to update faculty" }, { status: 500 });
  }
};
