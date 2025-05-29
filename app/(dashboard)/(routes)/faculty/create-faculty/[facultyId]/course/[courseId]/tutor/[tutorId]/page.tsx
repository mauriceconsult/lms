import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
// import { TutorActions } from "./_components/course-actions";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  Video,
  //   ListChecks
} from "lucide-react";
import { TutorDescriptionForm } from "./_components/tutor-description-form";
import { TutorCourseForm } from "./_components/tutor-course-form";
import { TutorObjectiveForm } from "./_components/tutor-objective-form";
import Link from "next/link";
import { TutorAccessForm } from "./_components/tutor-access-form";
import { TutorVideoForm } from "./_components/tutor-video-form";
import { TutorActions } from "./_components/tutor-actions";
import { TutorTitleForm } from "./_components/tutor-title-form";

const TutorIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
    tutorId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tutor = await db.tutor.findUnique({
    where: {
      id: params.tutorId,
      courseId: params.courseId,
      userId,
    },
    include: {
      muxData: true,
    },
  });
  const course = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  console.log(course);
  if (!course || !tutor) {
    return redirect("/");
  }
  const requiredFields = [
    tutor.courseId,
    tutor.objective,
    tutor.description,
    tutor.videoUrl,
    tutor.courseId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!tutor.isPublished && (
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
              <TutorActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                tutorId={params.tutorId}
                isPublished={tutor.isPublished}
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
            <TutorTitleForm
              initialData={tutor}
              facultyId={params.facultyId}
              courseId={tutor.courseId || ""}
              tutorId={tutor.id}
            />
            <TutorCourseForm
              initialData={tutor}
              facultyId={params.facultyId}
              tutorId={tutor.id}
              courseId={tutor.courseId || ""}
              options={course.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <TutorObjectiveForm
              initialData={tutor}
              facultyId={params.facultyId}
              tutorId={tutor.id}
              courseId={tutor.courseId || ""}
            />
            <TutorDescriptionForm
              initialData={tutor}
              facultyId={params.facultyId}
              tutorId={tutor.id}
              courseId={tutor.courseId || ""}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <TutorAccessForm
              initialData={tutor}
              facultyId={params.facultyId}
              tutorId={tutor.id}
              courseId={tutor.courseId || ""}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={Video} />
          <h2 className="text-xl">Add a video</h2>
        </div>
        <TutorVideoForm
          initialData={tutor}
          facultyId={params.facultyId}
          tutorId={tutor.id}
          courseId={tutor.courseId || ""}
        />
      </div>
    </>
  );
};
export default TutorIdPage;
