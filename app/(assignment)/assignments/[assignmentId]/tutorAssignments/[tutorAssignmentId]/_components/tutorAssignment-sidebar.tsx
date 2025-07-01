import { auth } from "@clerk/nextjs/server";
import { TutorAssignment } from "@prisma/client";
import { TutorAssignmentSidebarItem } from "./tutorAssignment-sidebar-item";

interface TutorAssignmentSidebarProps {
  tutorAssignment: TutorAssignment[];
};
  
export const TutorAssignmentSidebar = async ({ tutorAssignment }: TutorAssignmentSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">
            {tutorAssignment.length > 0 ? tutorAssignment[0].title : "No TutorAssignments"}
          </h1>
            </div>
            <div className="flex flex-col w-full">
              {tutorAssignment.map((faculty) => (
                  <TutorAssignmentSidebarItem
                  key={faculty.id}
                  id={faculty.id}
                  label={faculty.title}
                  tutorAssignmentId={faculty.id}
                  isCompleted={false} />
              ))}
            </div>
        </div>
    );
};
export default TutorAssignmentSidebar;