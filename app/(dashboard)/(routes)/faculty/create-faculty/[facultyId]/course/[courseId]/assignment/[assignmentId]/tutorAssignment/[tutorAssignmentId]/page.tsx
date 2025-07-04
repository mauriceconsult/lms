import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { TutorAssignmentDescriptionForm } from "./_components/tutorAssignment-description-form";
import Link from "next/link";
import { TutorAssignmentActions } from "./_components/tutorAssignment-actions";
import { TutorAssignmentAssignmentForm } from "./_components/tutorAssignment-Assignment-form";
import { TutorAssignmentTitleForm } from "./_components/tutorAssignment-title-form";

const TutorAssignmentIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
    assignmentId: string;
    tutorAssignmentId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tutorAssignment = await db.tutorAssignment.findUnique({
    where: {
      id: params.tutorAssignmentId,
      assignmentId: params.assignmentId,
      userId,
    },
  });
  const assignment = await db.assignment.findMany({
    orderBy: {
      title: "asc",
    },
  });
  console.log(assignment);
  if (!assignment || !tutorAssignment) {
    return redirect("/");
  }
  const requiredFields = [
    tutorAssignment.title,
    tutorAssignment.assignmentId,
    tutorAssignment.objective,
    tutorAssignment.description,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!tutorAssignment.isSubmitted && (
        <Banner
          variant="warning"
          label="This Tutor Assignment is unsubmitted. Please submit for the Assignment to be publishable."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${params.facultyId}/course/${params.courseId}/assignment/${params.assignmentId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignment creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Tutor Assignment creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <TutorAssignmentActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                assignmentId={params.assignmentId}
                tutorAssignmentId={params.tutorAssignmentId}
                isSubmitted={tutorAssignment.isSubmitted}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your Assignment</h2>
              </div>
            </div>
            <TutorAssignmentTitleForm
              initialData={tutorAssignment}
              facultyId={params.facultyId}
              courseId={params.courseId}
              assignmentId={tutorAssignment.assignmentId || ""}
              tutorAssignmentId={tutorAssignment.id}
            />
            <TutorAssignmentAssignmentForm
              initialData={tutorAssignment}
              facultyId={params.facultyId}
              courseId={params.courseId}
              tutorAssignmentId={tutorAssignment.id}
              assignmentId={tutorAssignment.assignmentId || ""}
              options={assignment.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <TutorAssignmentDescriptionForm
              initialData={tutorAssignment}
              facultyId={params.facultyId}
              courseId={params.courseId}
              tutorAssignmentId={tutorAssignment.id}
              assignmentId={tutorAssignment.assignmentId || ""}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default TutorAssignmentIdPage;
