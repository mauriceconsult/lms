import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ adminId: string; }>}
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const adminOwner = await db.admin.findUnique({
      where: {
        id: (await params).adminId,
      },
    });
    if (!adminOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
       
    const attachment = await db.attachment.create({
      data: {
        url,        
        adminId: (await params).adminId,
      },
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("ADMIN_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}