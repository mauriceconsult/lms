import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, File, DollarSign } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { CourseFacultyForm } from "./_components/course-faculty-form";
import { CourseActions } from "./_components/course-actions";
import { CourseTitleForm } from "./_components/course-title-form";
import { CourseDescriptionForm } from "./_components/course-description-form";
import { CourseImageForm } from "./_components/course-image-form";
import { CourseAttachmentForm } from "./_components/course-attachment-form";
import { CourseTutorForm } from "./_components/course-tutor-form";
import { CourseAssignmentForm } from "./_components/course-assignment-form";
import { CourseCourseNoticeboardForm } from "./_components/course-courseNoticeboard-form";
import { CourseAmountForm } from "./_components/course-amount-form";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    courseId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const course = await db.course.findUnique({
    where: {
      id: resolvedParams.courseId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      assignments: {
        orderBy: {
          position: "asc",
        },
      },
      courseNoticeboards: true,
      tuitions: true,
      tutors: true,
    },
  });

  const faculty = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!course || faculty.length === 0) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Course or school not found:`,
      { facultyId: resolvedParams.facultyId, userId }
    );
    return redirect("/");
  }

  // Memoize faculty data to ensure stability
  const initialData = {
    ...course,
    description: course.description ?? "", // Ensure description is never null
  };

  const requiredFields = [
    initialData.title,
    initialData.facultyId,  
    initialData.description,
    initialData.imageUrl,
    initialData.amount,
    initialData.tutors.length > 0,
    initialData.assignments.length > 0,
  ];
  const optionalFields = [
    initialData.courseNoticeboards.length > 0,
    initialData.attachments.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!initialData.isPublished && (
        <Banner
          variant="warning"
          label="This Course is not published yet. To publish, complete the required* fields and ensure that you have at least a Published Tutor/Topic and Assignment."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Course creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseActions
                disabled={!isComplete}
                facultyId={resolvedParams.facultyId}
                courseId={course.id}
                isPublished={initialData.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Course details</h2>
              </div>
              <CourseTitleForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={course.id}
              />
              <CourseFacultyForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={course.id}
                options={faculty.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <CourseDescriptionForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={course.id}
              />
              <CourseImageForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={course.id}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={DollarSign} />
                  <h2 className="text-xl">Sell Your Course</h2>
                </div>
                <CourseAmountForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <CourseAttachmentForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course Tutors</h2>
                </div>
                <CourseTutorForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course Assignments</h2>
                </div>
                <CourseAssignmentForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course Noticeboard</h2>
                </div>
                <CourseCourseNoticeboardForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={course.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
