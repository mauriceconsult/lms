import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import Link from "next/link";
import { AssignmentActions } from "./_components/assignment-actions";
import { AssignmentTitleForm } from "./_components/assignment-title-form";
import { AssignmentCourseForm } from "./_components/assignment-course-form";
import { AssignmentDescriptionForm } from "./_components/assignment-description-form";

const AssignmentIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
    assignmentId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const assignment = await db.assignment.findUnique({
    where: {
      id: resolvedParams.assignmentId,
      userId,
    },
  });

  const tutor = await db.tutor.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!assignment || tutor.length === 0) {
    console.error(
      `[${new Date().toISOString()} AssignmentIdPage] Assignment or school not found:`,
      { tutorId: resolvedParams.tutorId, userId }
    );
    return redirect("/");
  }

  // Memoize faculty data to ensure stability
  const initialData = {
    ...assignment,
    description: assignment.description ?? "", // Ensure description is never null
  };

  const requiredFields = [
    initialData.title,
    initialData.tutorId ?? "",
    initialData.description,    
    initialData.objective,   
  ];
  // const allFields = [...requiredFields, ...optionalFields];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!initialData.isPublished && (
        <Banner
          variant="warning"
          label="This Assignment is not published yet. To publish, complete the required* fields. Ensure that you have at least a published Assignment/Topic and Assignment."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${(await params).facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Assignment creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <AssignmentActions
                disabled={!isComplete}
                // initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                assignmentId={resolvedParams.assignmentId}
                // tutorId={resolvedParams.tutorId}
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
                <h2 className="text-xl">Enter the Assignment details</h2>
              </div>
              <AssignmentTitleForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                assignmentId={resolvedParams.assignmentId}
                tutorId={resolvedParams.tutorId}
              />
              <AssignmentCourseForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                assignmentId={resolvedParams.assignmentId}
                // tutorId={resolvedParams.tutorId}
                options={tutor.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <AssignmentDescriptionForm
                initialData={initialData}
                facultyId={initialData.id}
                courseId={resolvedParams.courseId}
                assignmentId={resolvedParams.assignmentId}
                // tutorId={resolvedParams.tutorId}
              />              
            </div>    
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentIdPage;
