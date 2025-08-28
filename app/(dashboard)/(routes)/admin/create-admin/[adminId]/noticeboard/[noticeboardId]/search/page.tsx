import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNoticeboards } from "@/actions/get-noticeboards";
import { NoticeboardIdSearchInput } from "./_components/noticeboard-search-input";
import { NoticeboardsList } from "./_components/noticeboards-list";
import { Admins } from "../../../search/_components/admins";

interface NoticeboardSearchPageProps {
  searchParams: Promise<{
    title: string;
    noticeboardId: string;
  }>
}

const NoticeboardSearchPage = async ({
  searchParams
}: NoticeboardSearchPageProps) => {
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
    ...await searchParams
  }) 
  return (
    <>
      <div className="px-6 pt-4 md:hidden md:mb-0 block">
        <NoticeboardIdSearchInput />
      </div>
      <div className="p-6">
        <Admins items={admins} />
        <NoticeboardsList items={noticeboards} />
      </div>
    </>
  );
};

export default NoticeboardSearchPage;
