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
    courseNoticeboardId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const courseNoticeboard = await db.courseNoticeboard.findFirst({
    where: {
      id: resolvedParams.courseNoticeboardId,
      courseId: resolvedParams.facultyId,     
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
  if (!courseNoticeboard || !course) {
    return redirect("/");
  }
  const requiredFields = [courseNoticeboard.title, courseNoticeboard.description];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;

  return (
    <>
      {!courseNoticeboard.isPublished && (
        <Banner
          variant="warning"
          label="This CourseNoticeboard is unpublished. Once published, students can submit their course projects."
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
                  CourseNoticeboard creation
                </h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseCourseNoticeboardActions
                disabled={false}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                courseCourseNoticeboardId={resolvedParams.courseNoticeboardId}
                isPublished={false}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the CourseNoticeboard details</h2>
              </div>
              <CourseCourseNoticeboardTitleForm
                initialData={courseNoticeboard}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                courseCourseNoticeboardId={resolvedParams.courseNoticeboardId}
              />
              <CourseCourseNoticeboardCourseForm
                initialData={courseNoticeboard}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                courseCourseNoticeboardId={resolvedParams.courseNoticeboardId}
                options={course.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <CourseCourseNoticeboardDescriptionForm
                initialData={courseNoticeboard}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                courseCourseNoticeboardId={resolvedParams.courseNoticeboardId}
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
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                  courseCourseNoticeboardId={resolvedParams.courseNoticeboardId}
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
