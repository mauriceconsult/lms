// app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/page.tsx
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  File,
  ArrowLeft,
  Eye,
  Image,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";
import { CourseTitleForm } from "./_components/course-title-form";
import { CourseDescriptionForm } from "./_components/course-description-form";
import { CourseFacultyForm } from "./_components/course-faculty-form";
import { CourseAccessForm } from "./_components/course-access-form";
import { CourseImageForm } from "./_components/course-image-form";
import { CourseAttachmentForm } from "./_components/course-attachment-form";
import { CourseTutorForm } from "./_components/course-tutor-form";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";

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
    console.error(
      `[${new Date().toISOString()} CourseIdPage] No userId from auth`
    );
    return redirect("/");
  }

  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams);

  if (!resolvedParams.facultyId || !resolvedParams.courseId) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Invalid params`,
      resolvedParams
    );
    return <div>Invalid faculty or course ID</div>;
  }

  const course = await db.course.findUnique({
    where: {
      id: resolvedParams.courseId,
      userId,
      facultyId: resolvedParams.facultyId,
    },
    include: {
      tutors: {
        where: { isPublished: true },
      },
      attachments: true,
      courseworks: true,
    },
  });

  const faculty = await db.faculty.findUnique({
    where: {
      id: resolvedParams.facultyId,
      userId,
    },
  });

  // Fetch all faculties for the options prop
  const faculties = await db.faculty.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  console.log("Course query result:", JSON.stringify(course, null, 2));
  console.log("Faculty query result:", JSON.stringify(faculty, null, 2));
  console.log("Faculties for options:", JSON.stringify(faculties, null, 2));

  if (!course || !faculty) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Course or faculty not found:`,
      {
        facultyId: resolvedParams.facultyId,
        courseId: resolvedParams.courseId,
        userId,
      }
    );
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Course or Faculty Not Found</h2>
        <p>
          The requested course or faculty does not exist or you do not have
          access to it.
        </p>
        <p>Faculty ID: {resolvedParams.facultyId}</p>
        <p>Course ID: {resolvedParams.courseId}</p>
        <p>User ID: {userId}</p>
      </div>
    );
  }

  const initialData = {
    ...course,
    description: course.description ?? "",
    imageUrl: course.imageUrl ?? null,
    attachments: course.attachments ?? [],
    tutors: course.tutors ?? [],
    courseworks: course.courseworks ?? [],
  };

  const requiredFields = [
    initialData.title,
    initialData.description,
    initialData.imageUrl,
    initialData.facultyId,
    initialData.tutors.length > 0,
    initialData.courseworks.length > 0,
  ];
  const optionalFields = [initialData.attachments.length > 0];
  const totalFields = [...requiredFields, ...optionalFields].length;
  const completedFields = [...requiredFields, ...optionalFields].filter(
    Boolean
  ).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <DashboardLayout
      facultyId={resolvedParams.facultyId}
      courseId={resolvedParams.courseId}
    >
      {!initialData.isPublished && (
        <Banner
          variant="warning"
          label="This Course is unpublished. To publish, complete the required* fields and ensure you have at least one published Tutor and one Coursework."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${resolvedParams.facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation
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
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
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
                <h2 className="text-xl">Enter course details</h2>
              </div>
              <CourseTitleForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
              />
              <CourseFacultyForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                options={faculties.map((faculty) => ({
                  label: faculty.title,
                  value: faculty.id,
                }))}
              />
              <CourseDescriptionForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">Access settings</h2>
                </div>
                <CourseAccessForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl">Add a course image</h2>
                </div>
                <CourseImageForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & attachments</h2>
                </div>
                <CourseAttachmentForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course tutors</h2>
                </div>
                <CourseTutorForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
                  courseId={resolvedParams.courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseIdPage;
