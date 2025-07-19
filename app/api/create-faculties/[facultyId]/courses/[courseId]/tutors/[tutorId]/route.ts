import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ facultyId: string; courseId: string; tutorId: string }>;
  }
) {
  try {
    const { userId } = await auth();
    const { courseId, tutorId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await req.json();

    const tutor = await db.tutor.update({
      where: {
        id: tutorId,
        courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("[TUTOR_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
