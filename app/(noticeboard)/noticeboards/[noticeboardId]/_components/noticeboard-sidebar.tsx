import { auth } from "@clerk/nextjs/server";
import { Noticeboard } from "@prisma/client";
import { NoticeboardSidebarItem } from "./noticeboard-sidebar-item";

interface NoticeboardSidebarProps {
  noticeboard: Noticeboard[];
};
  
export const NoticeboardSidebar = async ({ noticeboard }: NoticeboardSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">
            {noticeboard.length > 0 ? noticeboard[0].title : "No Noticeboards"}
          </h1>
            </div>
            <div className="flex flex-col w-full">
              {noticeboard.map((faculty) => (
                  <NoticeboardSidebarItem
                      key={faculty.id}
                      id={faculty.id}
                      label={faculty.title}                     
                      noticeboardId={faculty.id}                      
                  />
              ))}
            </div>
        </div>
    );
};
export default NoticeboardSidebar;