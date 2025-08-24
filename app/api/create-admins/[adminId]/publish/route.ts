import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      adminId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownAdmin = await db.admin.findUnique({
      where: {
        id: (await params).adminId,
        userId,
      },
    });
    if (!ownAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const admin = await db.admin.findUnique({
      where: {
        id: (await params).adminId,
        userId,
      },
      include: {
        courses: true,        
        noticeboards: true,
      },
    }); 

    const hasPublishedCourse = admin?.courses.some(
      (course) => course.isPublished
    );
    if (
      !admin ||
      !admin.description ||
      !admin.title ||
      !admin.imageUrl ||
      !hasPublishedCourse     
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const publishedadmin = await db.admin.update({
      where: {
        id: (await params).adminId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedadmin);
  } catch (error) {
    console.log("[ADMIN_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
