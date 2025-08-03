import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns } from "./_components/coursework-columns";
import { DataTable } from "./_components/coursework-data-table";

interface CourseworksPageProps {
  params: Promise<{ facultyId: string }>;
}

export default async function CourseworksPage({ params }: CourseworksPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId } = await params;
  const faculty = await db.faculty.findUnique({
    where: { id: facultyId },
  });

  if (!faculty) {
    return redirect("/");
  }

  const courseworks = await db.coursework.findMany({
    where: { facultyId },
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
