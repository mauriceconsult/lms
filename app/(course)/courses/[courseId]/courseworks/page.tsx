import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns } from "./_components/coursework-columns";
import { DataTable } from "./_components/coursework-data-table";

interface CourseworksPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseworksPage({ params }: CourseworksPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return redirect("/");
  }

  const courseworks = await db.coursework.findMany({
    where: { courseId },
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courseworks} />
    </div>
  );
};
