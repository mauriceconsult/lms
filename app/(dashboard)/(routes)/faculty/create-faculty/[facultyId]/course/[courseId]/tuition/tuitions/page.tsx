import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/tuition-data-table";
import { columns } from "./_components/tuition-columns";


const TuitionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tuitions = await db.tuition.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={tuitions} />
    </div>
  );
};
export default TuitionsPage;
