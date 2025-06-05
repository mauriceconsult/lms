import { db } from "@/lib/db";
import { NoticeboardSearchInput } from "./_components/notice-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoticesList } from "./_components/notices-list";
import { getNoticeboards } from "@/actions/get-notices";
import { Faculties } from "../../../../search/_components/faculties";

interface NoticeboardSearchPageProps {
  searchParams: {
    title: string;
    facultyId: string;
  };
}
const NoticeboardSearchPage = async ({
  searchParams,
}: NoticeboardSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const notices = await getNoticeboards({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <NoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Faculties items={faculties} />
        <NoticesList items={notices} />
      </div>
    </>
  );
};
export default NoticeboardSearchPage;
