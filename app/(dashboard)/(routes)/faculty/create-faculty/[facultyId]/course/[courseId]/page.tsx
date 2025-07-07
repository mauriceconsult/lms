import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  CircleDollarSign,
  // Eye,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import { CourseDescriptionForm } from "./_components/course-description-form";
import { CourseImageForm } from "./_components/course-image-form";
import { CourseFacultyForm } from "./_components/course-faculty-form";
import { CourseAttachmentForm } from "./_components/course-attachment-form";
import { CourseAmountForm } from "./_components/course-amount-form";
import { CourseTutorForm } from "./_components/course-tutor-form";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";
import { CourseTitleForm } from "./_components/course-title-form";
import { CourseAssignmentForm } from "./_components/course-assignment-form";
import { CourseTuitionForm } from "./_components/course-tuition-form";
import { CourseCourseNoticeboardForm } from "./_components/course-courseNoticeboard-form";

const CourseIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      facultyId: params.facultyId,
      userId,
    },
    include: {
      courseNoticeboards: true,
      assignments: true,
      tuitions: true,
      tutors: {
        orderBy: {
          position: "asc",
        },
      },
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
  console.log(faculty);
  if (!faculty || !course) {
    return redirect("/");
  }
  const requiredFields = [
    course.description,
    course.facultyId,
    course.imageUrl,
    course.amount,
    course.tutors.length > 0,    
  ];
  const optionalFields = [
    course.attachments.length > 0,
    course.tutors.length > 0,
    course.courseNoticeboards.length > 0,
    course.assignments.length > 0,
    course.tuitions.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This Course is unpublished. A published Topic is required for this Course to be publishable."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${params.facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Course creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                isPublished={course.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>
            </div>
            <CourseTitleForm
              initialData={course}
              facultyId={course.facultyId || ""}
              courseId={course.id}
            />

            <CourseFacultyForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ""}
              options={faculty.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <CourseDescriptionForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ""}
            />
            <CourseImageForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ""}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your Course</h2>
              </div>
              <CourseAmountForm
                initialData={course}
                courseId={course.id}
                facultyId={course.facultyId || ""}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <CourseAttachmentForm
                initialData={course}
                courseId={course.id}
                facultyId={course.facultyId || ""}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Topics </h2>
              </div>
              <CourseTutorForm
                initialData={course}
                facultyId={course.facultyId || ""}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Notices </h2>
              </div>
              <CourseCourseNoticeboardForm
                initialData={course}
                facultyId={course.facultyId || ""}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Assignments </h2>
              </div>
              <CourseAssignmentForm
                initialData={course}
                facultyId={course.facultyId || ""}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Tuitions </h2>
              </div>
              <CourseTuitionForm
                initialData={course}
                facultyId={course.facultyId || ""}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CourseIdPage;
