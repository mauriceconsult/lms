import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
// import CourseSidebar from "./_components/notice-sidebar";
// import { CourseNavbar } from "./_components/notice-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { noticeId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please log in to view this page.</div>;
  }
  const notice = await db.noticeBoard.findUnique({
    where: {
      id: params.noticeId,
    },
  });

  if (!notice) {
    return <div>Notice not found.</div>;
  }
  return (
    <div className="h-full">
      {/* <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          notice={notice}
          progressCount={progressCount}
        />
      </div> */}
      {/* <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <CourseSidebar notice={notice} progressCount={progressCount} />
      </div> */}
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default CourseLayout;
