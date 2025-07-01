// import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Assignment, TutorAssignment, UserProgress} from "@prisma/client";
import { AssignmentSidebarItem } from "./assignment-sidebar-item";

interface AssignmentSidebarProps {
  assignment: Assignment & {
    tutorAssignments: (TutorAssignment & {
      userProgress: UserProgress[] | null;    
    })[]
  };
  progressCount: number;
}
export const AssignmentSidebar = async ({
  assignment,
  // progressCount,
}: AssignmentSidebarProps) => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please log in to view this page.</div>;
  }
  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_assignmentId: {
  //       userId,
  //       assignmentId: assignment.id,
  //     },
  //   },
  // });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
              <h1 className="font-semibold">{assignment.title}</h1>
              {/**TODO: Check purchase and add progress */}
          </div>
          <div className="flex flex-col w-full">
              {assignment.tutorAssignments.map((tutorAssignment) => (
                  <AssignmentSidebarItem
                      key={tutorAssignment.id}
                      id={tutorAssignment.id}
                      label={tutorAssignment.title}
                      isCompleted={!!tutorAssignment.userProgress?.[0]?.isCompleted}
                      assignmentId={assignment.id}
                      // isLocked={!tutorAssignment.isSubmitted && !purchase}
                  />
              ))}              
          </div>
    </div>
  );
};
export default AssignmentSidebar;
