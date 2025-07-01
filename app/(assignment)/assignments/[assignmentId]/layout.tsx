import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import AssignmentSidebar from "./_components/assignment-sidebar";
import { AssignmentNavbar } from "./_components/assignment-navbar";
import { redirect } from "next/navigation";

const AssignmentLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { assignmentId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const assignment = await db.assignment.findUnique({
    where: {
      id: params.assignmentId,
    },
    include: {
      tutorAssignments: {
        where: {
          isSubmitted: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!assignment) {
    return <div>Assignment not found.</div>;
  }
  const progressCount = await getProgress(userId, assignment.id);
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <AssignmentNavbar assignment={assignment} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <AssignmentSidebar assignment={assignment} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default AssignmentLayout;
