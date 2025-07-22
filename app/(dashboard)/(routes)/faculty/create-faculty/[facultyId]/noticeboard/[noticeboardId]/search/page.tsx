import { db } from "@/lib/db";
import { NoticeboardSearchInput } from "./_components/noticeboard-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Faculties } from "../../../search/_components/faculties";
import { NoticeboardsList } from "./_components/noticeboards-list";
import { getNoticeboards } from "@/actions/get-noticeboards";

interface NoticeboardIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    facultyId: string;
  }>;
}
const NoticeboardSearchPage = async ({
  searchParams,
}: NoticeboardIdSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const noticeboards = await getNoticeboards({
    userId,
    ...await searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <NoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Faculties items={faculties} />
        <NoticeboardsList items={noticeboards} />
      </div>
    </>
  );
};
export default NoticeboardSearchPage;
