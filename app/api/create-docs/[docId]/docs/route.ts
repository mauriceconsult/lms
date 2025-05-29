import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { title } = body;
  if (!title) {
    return new Response("Missing title", { status: 400 });
  }
  const docOwner = await db.doc.findUnique({
    where: {
      id: params.id,
    },
    select: {
      userId: true,
    },
  });
  if (!docOwner) {
    return new Response("Details unavailable", { status: 404 });
  }
  if (docOwner.userId !== userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const lastDoc = await db.doc.findFirst({
    where: {
      id: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
    },
  });
  const newPosition = lastDoc ? Number(lastDoc.title) + 1 : 1;
  if (newPosition > 100) {
    return new Response("Maximum number of docs reached", { status: 400 });
  }
  try {
    const doc = await db.doc.create({
      data: {
        title: title,
        id: params.id,
        userId: userId,
      },
    });
    return NextResponse.json(doc);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}