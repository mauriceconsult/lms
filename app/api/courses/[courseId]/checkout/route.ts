import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      }
    });
    const tuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        }
      }
    });
    if (tuition) {
      return new NextResponse("Tuition already paid", { status: 400 });
    }
    if (!course) {
      return new NextResponse("Not found.", { status: 404 });
    }
    {/*add momo line item*/}
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error); 
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}