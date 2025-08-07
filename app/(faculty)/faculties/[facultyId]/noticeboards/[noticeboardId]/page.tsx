import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoticeboardWithComments } from "@/lib/prisma";
import NoticeboardClient from "./noticeboard-client";

export default async function NoticeboardPage({
  params,
}: {
  params: Promise<{ facultyId: string; noticeboardId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { facultyId, noticeboardId } = await params;

  const noticeboard: NoticeboardWithComments | null = await db.noticeboard.findUnique({
    where: { id: noticeboardId, facultyId, isPublished: true },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });

  if (!noticeboard) {
    redirect(`/faculties/${facultyId}/noticeboards`);
  }

  return (
    <NoticeboardClient
      facultyId={facultyId}
      noticeboardId={noticeboardId}
      noticeboard={noticeboard}
    />
  );
}
