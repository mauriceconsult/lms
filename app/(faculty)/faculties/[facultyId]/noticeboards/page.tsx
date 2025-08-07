import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/noticeboard-data-table";

export default async function NoticeboardsPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const { facultyId } = await params;

  const noticeboards = await db.noticeboard.findMany({
    where: { facultyId, isPublished: true },
    select: {
      id: true,
      title: true,
      userId: true,
      description: true,
      facultyId: true,
      position: true,
      isPublished: true,
      publishDate: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Noticeboards</h1>
        {isAdmin && (
          <Link href={`/faculties/${facultyId}/noticeboards/create`}>
            <Button>Create Noticeboard</Button>
          </Link>
        )}
      </div>
      <DataTable data={noticeboards} />
    </div>
  );
}
