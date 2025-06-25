import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/courseNoticeboard-data-table";
import { columns } from "./_components/courseNoticeboard-columns";

const CourseNoticeboardsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courseNoticeboards = await db.courseNoticeboard.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courseNoticeboards} />
    </div>
  );
};
export default CourseNoticeboardsPage;
