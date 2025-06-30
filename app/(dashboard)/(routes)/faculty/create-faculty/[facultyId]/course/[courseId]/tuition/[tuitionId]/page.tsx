import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import Link from "next/link";
import { TuitionActions } from "./_components/tuition-actions";
import { TuitionTitleForm } from "./_components/tuition-title-form";
import { TuitionCourseForm } from "./_components/tuition-course-form";
import { TuitionPartyIdForm } from "./_components/tuition-partyId-form";


const TuitionIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
    tuitionId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tuition = await db.tuition.findUnique({
    where: {
      id: params.tuitionId,
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
  if (!course || !tuition) {
    return redirect("/");
  }
  const requiredFields = [
    tuition.title,
    tuition.courseId,
    tuition.partyId,
   
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!tuition.isPaid && (
        <Banner
          variant="warning"
          label="This Tuition is unpaid. It will not be visible to the Tutor."
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
                <h1 className="text-2xl font-medium">Tuition creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <TuitionActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                tuitionId={params.tuitionId}
                isPaid={tuition.isPaid}
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
            <TuitionTitleForm
              initialData={tuition}
              facultyId={params.facultyId}
              courseId={tuition.courseId || ""}
              tuitionId={tuition.id}
            />
            <TuitionCourseForm
              initialData={tuition}
              facultyId={params.facultyId}
              tuitionId={tuition.id}
              courseId={tuition.courseId || ""}
              options={course.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <TuitionPartyIdForm
              initialData={tuition}
              facultyId={params.facultyId}
              courseId={tuition.courseId || ""}
              tuitionId={tuition.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default TuitionIdPage;
