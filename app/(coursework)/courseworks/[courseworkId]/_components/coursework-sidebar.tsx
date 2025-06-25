import { auth } from "@clerk/nextjs/server";
import { Coursework } from "@prisma/client";
import { CourseworkSidebarItem } from "./coursework-sidebar-item";

interface CourseworkSidebarProps {
  coursework: Coursework[];
};
  
export const CourseworkSidebar = async ({ coursework }: CourseworkSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">
            {coursework.length > 0 ? coursework[0].title : "No Courseworks"}
          </h1>
            </div>
            <div className="flex flex-col w-full">
              {coursework.map((faculty) => (
                  <CourseworkSidebarItem
                      key={faculty.id}
                      id={faculty.id}
                      label={faculty.title}                     
                      courseworkId={faculty.id}                      
                  />
              ))}
            </div>
        </div>
    );
};
export default CourseworkSidebar;