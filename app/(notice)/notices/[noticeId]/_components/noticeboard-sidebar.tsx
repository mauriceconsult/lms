import { auth } from "@clerk/nextjs/server";
import { Course, Noticeboard } from "@prisma/client";
import { NoticeboardSidebarItem } from "./noticeboard-sidebar-item";

interface NoticeboardSidebarProps {
  noticeBoard: Noticeboard & {
    courses: (Course)[];
  };
}
export const NoticeboardSidebar = async ({ noticeBoard }: NoticeboardSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{noticeBoard.title}</h1>
            </div>
            <div className="flex flex-col w-full">
              {noticeBoard.courses.map((course) => (
                  <NoticeboardSidebarItem
                      key={course.id}
                      id={course.id}
                      label={course.title}                     
                      noticeId={noticeBoard.id}                      
                  />
              ))}
            </div>
        </div>
    );
};
export default NoticeboardSidebar;