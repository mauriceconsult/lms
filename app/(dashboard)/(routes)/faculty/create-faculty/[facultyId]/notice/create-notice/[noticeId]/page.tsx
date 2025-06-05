import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoticeTitleForm } from "./_components/notice-title-form";
import { LayoutDashboard, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { NoticeImageForm } from "./_components/notice-image-form";
import { NoticeDescriptionForm } from "./_components/notice-description-form";
import { NoticeFacultyForm } from "./_components/notice-faculty-form";
import { NoticeAttachmentForm } from "./_components/notice-attachment-form";
import { Banner } from "@/components/banner";
import { NoticeActions } from "./_components/notice-actions";

const NoticeIdPage = async ({
  params,
}: {
  params: {
    noticeId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const notice = await db.noticeBoard.findFirst({
    where: {
      id: params.noticeId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },      
    },
  });
  const faculty = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  if (!notice || !faculty) {
    return redirect("/");
  }
  const requiredFields = [notice.title, notice.description, notice.imageUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!notice.isPublished && (
        <Banner
          variant="warning"
          label="This Notice is unpublished. It will not be visible to the Faculty."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Notice creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <NoticeActions
                disabled={!isComplete}
                noticeId={params.noticeId}
                isPublished={notice.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Notice details</h2>
              </div>
              <NoticeTitleForm initialData={notice} noticeId={notice.id} />
              <NoticeFacultyForm
                initialData={notice}
                noticeId={notice.id}
                facultyId={notice.facultyId || ""}
                options={faculty.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <NoticeDescriptionForm
                initialData={notice}
                noticeId={notice.id}
              />
              <NoticeImageForm initialData={notice} noticeId={notice.id} />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <NoticeAttachmentForm
                  initialData={notice}
                  noticeId={notice.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeIdPage;
