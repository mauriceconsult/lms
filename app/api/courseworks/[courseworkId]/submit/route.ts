import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseworkId: string; facultyId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress)
      return new NextResponse("Unauthorized", { status: 401 });
    const faculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        isPublished: true,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found.", { status: 404 });
    }
    const coursework = await db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId: user.id,
      },
    });

    return new NextResponse(JSON.stringify(coursework), { status: 201 });
  } catch (error) {
    console.log("[COURSEWORK_ID_SUBMIT]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
