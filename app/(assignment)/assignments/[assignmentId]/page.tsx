import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const AssignmentIdpage = async ({ params }: { params: { assignmentId: string } }) => {
  const assignment = await db.assignment.findUnique({
    where: {
      id: params.assignmentId,
    },
    include: {
      tutorAssignments: {
        where: {
          isSubmitted: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!assignment) {
    return redirect("/")
  }
  return redirect(
    `/assignments/${assignment.id}/tutorAssignments/${assignment.tutorAssignments}`
  );
};

export default AssignmentIdpage;
