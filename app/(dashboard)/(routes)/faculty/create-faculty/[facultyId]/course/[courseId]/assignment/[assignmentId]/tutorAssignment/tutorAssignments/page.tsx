import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/tutorAssignment-data-table";
import { columns } from "./_components/tutorAssignment-columns";


const TutorAssignmentsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tutorAssignments = await db.tutorAssignment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={tutorAssignments} />
    </div>
  );
};
export default TutorAssignmentsPage;
