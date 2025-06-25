import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import NoticeboardSidebar from "./_components/noticeboard-sidebar";
import { NoticeboardNavbar } from "./_components/noticeboard-navbar";

const NoticeboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { noticeboardId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please log in to view this page.</div>;
  }

  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeboardId,
    },
    include: {
      attachments: true,
    },
  });
  if (!noticeboard) {
    return <div>Noticeboard not found.</div>;
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <NoticeboardNavbar noticeboard={[noticeboard]} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <NoticeboardSidebar noticeboard={[noticeboard]} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default NoticeboardLayout;
