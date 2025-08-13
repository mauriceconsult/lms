import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, File, ArrowLeft } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { NoticeboardFacultyForm } from "./_components/noticeboard-faculty-form";
import { Banner } from "@/components/banner";
import { NoticeboardActions } from "./_components/noticeboard-actions";
import { NoticeboardTitleForm } from "./_components/noticeboard-title-form";
import { NoticeboardAttachmentForm } from "./_components/noticeboard-attachment-form";
import Link from "next/link";
import { NoticeboardDescriptionForm } from "./_components/noticeboard-description-form";

const NoticeboardIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    noticeboardId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const noticeboard = await db.noticeboard.findFirst({
    where: {
      id: (await params).noticeboardId,
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
  if (!noticeboard || !faculty) {
    return redirect("/");
  }
  const requiredFields = [
    noticeboard.title,
    noticeboard.facultyId,
    noticeboard.description,    
  ];
  const optionalFields = [
    noticeboard.attachments.length > 0,
  ];
  const totalFields = requiredFields.length + optionalFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!noticeboard.isPublished && (
        <Banner
          variant="warning"
          label="This Noticeboard is unpublished. It will not be visible to the Faculty."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${(await params).facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Noticeboard creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <NoticeboardActions
                disabled={!isComplete}
                noticeboardId={(await params).noticeboardId}
                isPublished={noticeboard.isPublished}
                facultyId={(await params).facultyId}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Noticeboard details</h2>
              </div>
              <NoticeboardTitleForm
                initialData={noticeboard}
                noticeboardId={noticeboard.id}
                facultyId={noticeboard.facultyId || ""}
              />
              <NoticeboardFacultyForm
                initialData={noticeboard}
                noticeboardId={noticeboard.id}
                facultyId={noticeboard.facultyId || ""}
                options={faculty.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <NoticeboardDescriptionForm
                initialData={noticeboard}
                noticeboardId={noticeboard.id}
                facultyId={noticeboard.facultyId || ""}
              />     
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <NoticeboardAttachmentForm
                  initialData={noticeboard}
                  noticeboardId={noticeboard.id}
                  facultyId={noticeboard.facultyId || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeboardIdPage;
