import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const NoticeboardIdPage = async ({ params }: { params: { noticeboardId: string } }) => {
  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeboardId,
    },
  });
  if (!noticeboard) {
    return redirect("/");
  }
return redirect(`/faculties/${noticeboard.id}`);
};

export default NoticeboardIdPage;
