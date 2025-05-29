import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/tutor-columns";
import { DataTable } from "./_components/tutor-data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const TutorsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const topics = await db.tutor.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={topics} />
    </div>
  );
};
export default TutorsPage;
