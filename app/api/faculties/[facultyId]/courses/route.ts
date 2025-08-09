import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const courses = await db.course.findMany({
    where: {
      facultyId: (await params).facultyId,
      isPublished: true,
    },
    select: {
      id: true,
    },
    orderBy: { title: "asc" },
    take: 1, // Get only the first course
  });

  return NextResponse.json(courses);
}
