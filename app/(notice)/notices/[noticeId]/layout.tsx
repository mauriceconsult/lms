import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoticeboardNavbar } from "./_components/noticeboard-navbar";
import NoticeboardSidebar from "./_components/noticeboard-sidebar";

const NoticeboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { noticeId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeId,
    },
    include: {
      courses: true,
    },
  });

  if (!noticeboard) {
   return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <NoticeboardNavbar noticeBoard={noticeboard}         
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <NoticeboardSidebar noticeBoard={noticeboard}  />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default NoticeboardLayout;
