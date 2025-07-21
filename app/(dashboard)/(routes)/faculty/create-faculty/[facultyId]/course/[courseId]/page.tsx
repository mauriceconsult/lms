import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";
import { CourseTitleForm } from "./_components/course-title-form";
import { CourseFacultyForm } from "./_components/course-faculty-form";
import { CourseAttachmentForm } from "./_components/course-attachment-form";
import { CourseCourseNoticeboardForm } from "./_components/course-courseNoticeboard-form";
import { CourseDescriptionForm } from "./_components/course-description-form";
import { CourseImageForm } from "./_components/course-image-form";
import { CourseTutorForm } from "./_components/course-tutor-form";
import { CourseAssignmentList } from "./_components/course-assignment-list";
import { Course, Tutor, Assignment } from "@prisma/client";

interface CourseIdPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
  }>;
}

// Explicitly type the course with relations
type CourseWithRelations = Course & {
  courseNoticeboards: { id: string }[];
  tuitions: { id: string }[];
  tutors: Tutor[];
  attachments: { id: string; name: string; url: string; createdAt: Date }[];
  assignments: (Assignment & { userProgress: { isCompleted: boolean }[] })[];
  faculty: { id: string; title: string } | null;
};

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      facultyId,
      userId,
    },
    include: {
      courseNoticeboards: true,
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
      assignments: {
        select: {
          id: true,
          userId: true,
          title: true,
          objective: true,
          description: true,
          courseId: true,
          position: true,
          isCompleted: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          userProgress: {
            select: {
              isCompleted: true,
            },
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
      faculty: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!course || !course.facultyId) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Course or faculty not found:`,
      { courseId, facultyId, userId, courseExists: !!course, facultyIdExists: !!course?.facultyId }
    );
    return redirect(`/faculty/create-faculty/${facultyId}`);
  }

  const facultyOptions = course.faculty
    ? [{ label: course.faculty.title, value: course.faculty.id }]
    : [];

  const assignmentsWithProgress = course.assignments.map((assignment) => ({
    ...assignment,
    isSubmitted: !!assignment.userProgress[0]?.isCompleted,
  }));

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.facultyId,
    course.tutors.length > 0,
    course.assignments.length > 0,
    course.tuitions.length > 0,
  ];
  const optionalFields = [course.courseNoticeboards.length > 0, course.attachments.length > 0];
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
          label="This Course is not published yet. You can publish it once you have completed all required fields."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course creation</h1>
            <span className="text-sm text-slate-700">
              Completed fields {completionText}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            facultyId={facultyId}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Course details</h2>
              </div>
              <CourseTitleForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
              <CourseFacultyForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
                options={facultyOptions}
              />
              <CourseDescriptionForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
              <CourseImageForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Tutors</h2>
              </div>
              <CourseTutorForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <CourseAttachmentForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Noticeboards</h2>
              </div>
              <CourseCourseNoticeboardForm
                initialData={course as CourseWithRelations}
                facultyId={facultyId}
                courseId={courseId}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Assignments</h2>
              </div>
              <CourseAssignmentList
                items={assignmentsWithProgress}
                facultyId={facultyId}
                courseId={courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}