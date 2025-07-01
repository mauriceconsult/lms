import { auth } from "@clerk/nextjs/server";
import { Tuition } from "@prisma/client";
import { TuitionSidebarItem } from "./tuition-sidebar-item";

interface TuitionSidebarProps {
  tuition: Tuition[];
};
  
export const TuitionSidebar = async ({ tuition }: TuitionSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">
            {tuition.length > 0 ? tuition[0].title : "No Tuitions"}
          </h1>
            </div>
            <div className="flex flex-col w-full">
              {tuition.map((faculty) => (
                  <TuitionSidebarItem
                  key={faculty.id}
                  id={faculty.id}
                  label={faculty.title}
                  tuitionId={faculty.id}
                  isCompleted={false} />
              ))}
            </div>
        </div>
    );
};
export default TuitionSidebar;