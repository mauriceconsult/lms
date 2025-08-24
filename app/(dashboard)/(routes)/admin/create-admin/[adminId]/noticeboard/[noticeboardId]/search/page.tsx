import { db } from "@/lib/db";
import { NoticeboardSearchInput } from "./_components/noticeboard-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoticeboardsList } from "./_components/noticeboards-list";
import { getNoticeboards } from "@/actions/get-noticeboards";
import AdminsList from "./_components/admins-list";
// import { AdminsList } from "./_components/admins-list"; // Add this import

interface NoticeboardIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    adminId: string;
  }>;
}

const NoticeboardSearchPage = async ({
  searchParams,
}: NoticeboardIdSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const admins = await db.admin.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const noticeboards = await getNoticeboards({
    userId,
    ...(await searchParams),
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <NoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <AdminsList items={admins} /> {/* Update to AdminsList */}
        <NoticeboardsList items={noticeboards} />
      </div>
    </>
  );
};

export default NoticeboardSearchPage;
