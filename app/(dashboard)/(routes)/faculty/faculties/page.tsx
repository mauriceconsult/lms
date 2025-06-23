import { auth } from "@clerk/nextjs/server";
import { columns } from "@/app/(dashboard)/(routes)/faculty/faculties/_components/faculties-columns";
import { DataTable } from "@/app/(dashboard)/(routes)/faculty/faculties/_components/faculties-data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const FacultiesPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={faculties} />
    </div>
  );
};
export default FacultiesPage;
