import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { docId: string } }
) {
  const body = await request.json();
  const { title } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!title || title.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const doc = await db.doc.findUnique({
    where: {
      id: params.docId,
      userId,
    },
  });
  if (!doc) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.doc.update({
    where: {
      id: doc.id,
    },
    data: {
      title,
    },
  });
  return new Response("Success", { status: 200 });
}

