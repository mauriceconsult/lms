import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  File,
  ArrowLeft,
  Eye,
  Video,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { TutorActions } from "./_components/tutor-actions";
import { TutorTitleForm } from "./_components/tutor-title-form";
import { TutorDescriptionForm } from "./_components/tutor-description-form";
import Link from "next/link";
import { TutorVideoForm } from "./_components/tutor-video-form";
import { TutorCourseForm } from "./_components/tutor-course-form";
import { TutorAccessForm } from "./_components/tutor-access-form";
import { TutorAttachmentForm } from "./_components/tutor-attachment-form";
import { TutorAssignmentForm } from "./_components/tutor-assignment-form";

const TutorIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const tutor = await db.tutor.findUnique({
    where: {
      id: resolvedParams.tutorId,
      userId,
    },
    include: {
      muxData: true,
      attachments: true,
      assignments: true,
    },
  });

  const course = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!tutor || course.length === 0) {
    console.error(
      `[${new Date().toISOString()} TutorIdPage] Tutor or school not found:`,
      { courseId: resolvedParams.courseId, userId }
    );
    return redirect("/");
  }
  const initialData = {
    ...tutor,
    description: tutor.description ?? "", 
  };

  const requiredFields = [
    initialData.title,
    initialData.courseId,
    initialData.description,
    initialData.videoUrl,
  ];
  const optionalFields = [initialData.attachments.length > 0];
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
          label="This Tutor is unpublished. 
          To publish, prepare and upload a good quality video clip of your lesson and an Assignment for the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${
                (await params).facultyId
              }/course/${(await params).courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Tutor creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <TutorActions
                disabled={!isComplete}
                facultyId={resolvedParams.facultyId}
                courseId={resolvedParams.courseId}
                tutorId={tutor.id}
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
                <h2 className="text-xl">Enter the Tutor details</h2>
              </div>
              <TutorTitleForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                tutorId={tutor.id}
              />
              <TutorCourseForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                tutorId={tutor.id}
                options={course.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <TutorDescriptionForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                tutorId={tutor.id}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">Access Settings</h2>
                </div>
                <TutorAccessForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={resolvedParams.courseId}
                  tutorId={tutor.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Video} />
                  <h2 className="text-xl">Add a Topic video</h2>
                </div>
                <TutorVideoForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={resolvedParams.courseId}
                  tutorId={tutor.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <TutorAttachmentForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={resolvedParams.courseId}
                  tutorId={tutor.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Tutor Assignments</h2>
                </div>
                <TutorAssignmentForm
                  initialData={initialData}
                  facultyId={initialData.id}
                  courseId={resolvedParams.courseId}
                  tutorId={tutor.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorIdPage;
