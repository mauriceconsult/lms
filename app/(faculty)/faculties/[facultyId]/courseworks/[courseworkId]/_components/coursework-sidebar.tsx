import { auth } from "@clerk/nextjs/server";
import { Coursework } from "@prisma/client";
import { CourseworkSidebarItem } from "./coursework-sidebar-item";

interface CourseworkSidebarProps {
  faculty: Coursework & {
    courseworks: (Coursework)[];
  };
}
export const CourseworkSidebar = async ({ faculty }: CourseworkSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{faculty.title}</h1>
            </div>
            <div className="flex flex-col w-full">
              {faculty.courseworks.map((coursework) => (
                  <CourseworkSidebarItem
                      key={coursework.id}
                      id={coursework.id}
                      label={coursework.title}                     
                      facultyId={faculty.id}                      
                  />
              ))}
            </div>
        </div>
    );
};
export default CourseworkSidebar;