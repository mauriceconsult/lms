import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: {courseworkId: string}}
) {
    try {
        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress)
            return new NextResponse("Unauthorized", { status: 401 });
        const coursework = await db.coursework.findUnique({
            where: {
                id: params.courseworkId,
                isPublished: true,
            }
        })
        if (!coursework) {
            return new NextResponse("Not found.", { status: 404 });
        }
        const studentProject = await db.studentProject.findUnique({
            where: {
                id: params.courseworkId,
                userId: user.id,
            }
        })
   
        // const courseworkOwner = await db.coursework.create({
        //     data: {
        //         userId: user.id,
        //         title: coursework.title,
        //         // Add other required fields for coursework creation here, for example:
        //         // title: coursework.title,
        //         // description: coursework.description,
        //         // isPublished: coursework.isPublished,
        //     }
        // })
      
        // You may want to return a response here, for example:
        return new NextResponse(JSON.stringify(studentProject), { status: 201 });
    } catch (error) {
        console.log("[COURSEWORK_ID_SUBMIT]", error);
        return new Response("Internal Error", { status: 500 });
    }
}