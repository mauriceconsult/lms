import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { AssignmentActions } from "./_components/assignment-actions";
import { AssignmentTitleForm } from "./_components/assignment-title-form";
import { AssignmentDescriptionForm } from "./_components/assignment-description-form";
import { AssignmentObjectiveForm } from "./_components/assignment-objective-form";
import { AssignmentCourseForm } from "./_components/assignment-course-form";

const AssignmentIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
    assignmentId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const assignment = await db.assignment.findUnique({
    where: {
      id: params.assignmentId,
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
  if (!course || !assignment) {
    return redirect("/");
  }
  const requiredFields = [
    assignment.courseId,
    assignment.objective,
    assignment.description,
    assignment.courseId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!assignment.isPublished && (
        <Banner
          variant="warning"
          label="This assignment is unpublished. It will not be visible to the students."
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
                <h1 className="text-2xl font-medium">Assignment creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <AssignmentActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseId={params.courseId}
                assignmentId={params.assignmentId}
                isPublished={assignment.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your assignment</h2>
              </div>
            </div>
            <AssignmentTitleForm
              initialData={assignment}
              facultyId={params.facultyId}
              courseId={assignment.courseId || ""}
              assignmentId={assignment.id}
            />
            <AssignmentCourseForm
              initialData={assignment}
              facultyId={params.facultyId}
              assignmentId={assignment.id}
              courseId={assignment.courseId || ""}
              options={course.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <AssignmentObjectiveForm
              initialData={assignment}
              facultyId={params.facultyId}
              assignmentId={assignment.id}
              courseId={assignment.courseId || ""}
            />
            <AssignmentDescriptionForm
              initialData={assignment}
              facultyId={params.facultyId}
              assignmentId={assignment.id}
              courseId={assignment.courseId || ""}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AssignmentIdPage;
