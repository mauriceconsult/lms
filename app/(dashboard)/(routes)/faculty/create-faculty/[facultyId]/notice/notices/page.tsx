import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/notice-columns";
import { DataTable } from "./_components/notice-data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const NoticesPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const notices = await db.noticeboard.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={notices} />
    </div>
  );
};
export default NoticesPage;
