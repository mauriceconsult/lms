import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
// import { CourseNoticeboardActions } from "./_components/course-actions";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  Video,
  //   ListChecks
} from "lucide-react";
import { CourseNoticeboardDescriptionForm } from "./_components/courseNoticeboard-description-form";
import { CourseNoticeboardCourseForm } from "./_components/courseNoticeboard-course-form";
import { CourseNoticeboardObjectiveForm } from "./_components/courseNoticeboard-objective-form";
import Link from "next/link";
import { CourseNoticeboardAccessForm } from "./_components/courseNoticeboard-access-form";
import { CourseNoticeboardVideoForm } from "./_components/courseNoticeboard-video-form";
import { CourseNoticeboardActions } from "./_components/courseNoticeboard-actions";
import { CourseNoticeboardTitleForm } from "./_components/courseNoticeboard-title-form";

const CourseNoticeboardIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
    courseNoticeboardId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courseNoticeboard = await db.courseNoticeboard.findUnique({
    where: {
      id: params.courseNoticeboardId,
      courseId: params.courseId,
      userId,
    },   
  });
  const course = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  console.log(course);
  if (!course || !courseNoticeboard) {
    return redirect("/");
  }
  const requiredFields = [
    courseNoticeboard.courseId,
    courseNoticeboard.objective,
    courseNoticeboard.description,
    courseNoticeboard.videoUrl,
    courseNoticeboard.courseId,
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
          label="This topic is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${params.facultyId}/course/${params.courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Topic creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <CourseNoticeboardActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                courseNoticeboardId={params.courseNoticeboardId}
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
                <h2 className="text-xl">Customize your topic</h2>
              </div>
            </div>
            <CourseNoticeboardTitleForm
              initialData={courseNoticeboard}
              facultyId={params.facultyId}
              courseId={courseNoticeboard.courseId || ""}
              courseNoticeboardId={courseNoticeboard.id}
            />
            <CourseNoticeboardCourseForm
              initialData={courseNoticeboard}
              facultyId={params.facultyId}
              courseNoticeboardId={courseNoticeboard.id}
              courseId={courseNoticeboard.courseId || ""}
              options={course.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <CourseNoticeboardObjectiveForm
              initialData={courseNoticeboard}
              facultyId={params.facultyId}
              courseNoticeboardId={courseNoticeboard.id}
              courseId={courseNoticeboard.courseId || ""}
            />
            <CourseNoticeboardDescriptionForm
              initialData={courseNoticeboard}
              facultyId={params.facultyId}
              courseNoticeboardId={courseNoticeboard.id}
              courseId={courseNoticeboard.courseId || ""}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <CourseNoticeboardAccessForm
              initialData={courseNoticeboard}
              facultyId={params.facultyId}
              courseNoticeboardId={courseNoticeboard.id}
              courseId={courseNoticeboard.courseId || ""}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={Video} />
          <h2 className="text-xl">Add a video</h2>
        </div>
        <CourseNoticeboardVideoForm
          initialData={courseNoticeboard}
          facultyId={params.facultyId}
          courseNoticeboardId={courseNoticeboard.id}
          courseId={courseNoticeboard.courseId || ""}
        />
      </div>
    </>
  );
};
export default CourseNoticeboardIdPage;
