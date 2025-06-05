import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const NoticeIdpage = async ({ params }: { params: { noticeId: string } }) => {
  const notice = await db.noticeBoard.findUnique({
    where: {
      id: params.noticeId,
    },
  });
  if (!notice) {
    return redirect("/")
  }
 return redirect(`/notices/${notice.id}/tutors/${notice.tutors[0].id}`);
};

export default NoticeIdpage;
