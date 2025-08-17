// app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/course-course-noticeboard/[courseCourseNoticeboardId]/page.tsx
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, File, ArrowLeft } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import Link from "next/link";
import { CourseCourseNoticeboardActions } from "./_components/course-course-noticeboard-actions";
import { CourseCourseNoticeboardTitleForm } from "./_components/course-course-noticeboard-title-form";
import { CourseCourseNoticeboardCourseForm } from "./_components/course-course-noticeboard-course-form";
import { CourseCourseNoticeboardDescriptionForm } from "./_components/course-course-noticeboard-description-form";
import { CourseCourseNoticeboardAttachmentForm } from "./_components/course-course-noticeboard-attachment-form";

const CourseNoticeboardIdPage = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
    facultyId: string;
    "course-course-noticeboardId": string; // Fixed parameter name
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  console.log("Page params:", resolvedParams);

  // Validate course-course-noticeboardId
  if (!resolvedParams["course-course-noticeboardId"]) {
    return redirect(
      `/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}`
    );
  }

  const courseNoticeboard = await db.courseNoticeboard.findUnique({
    where: {
      id: resolvedParams["course-course-noticeboardId"],
      courseId: resolvedParams.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const course = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!courseNoticeboard || !course.length) {
    return redirect(
      `/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}`
    );
  }

  const requiredFields = [
    courseNoticeboard.title,
    courseNoticeboard.description,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!courseNoticeboard.isPublished && (
        <Banner
          variant="warning"
          label="This Course Notice is unpublished. Once published, it will be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Course notice creation
                </h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseCourseNoticeboardActions
                disabled={!isComplete}
                courseCourseNoticeboardId={
                  resolvedParams["course-course-noticeboardId"]
                }
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                isPublished={courseNoticeboard.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Enter the Course notice details
                </h2>
              </div>
              <CourseCourseNoticeboardTitleForm
                initialData={courseNoticeboard}
                courseCourseNoticeboardId={
                  resolvedParams["course-course-noticeboardId"]
                }
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
              />
              <CourseCourseNoticeboardCourseForm
                initialData={courseNoticeboard}
                courseCourseNoticeboardId={
                  resolvedParams["course-course-noticeboardId"]
                }
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                options={course.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <CourseCourseNoticeboardDescriptionForm
                initialData={courseNoticeboard}
                courseCourseNoticeboardId={
                  resolvedParams["course-course-noticeboardId"]
                }
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <CourseCourseNoticeboardAttachmentForm
                  initialData={courseNoticeboard}
                  courseCourseNoticeboardId={
                    resolvedParams["course-course-noticeboardId"]
                  }
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseNoticeboardIdPage;
