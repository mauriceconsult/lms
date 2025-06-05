import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const NoticeIdpage = async ({ params }: { params: { noticeId: string } }) => {
  const notice = await db.noticeboard.findUnique({
    where: {
      id: params.noticeId,
    },
    include: {
      courses: true,
    },
  });
  if (!notice) {
    return redirect("/");
  }
  return redirect(`/notices/${notice.id}/courses/${notice.courses[0].id}`);
};
export default NoticeIdpage;
