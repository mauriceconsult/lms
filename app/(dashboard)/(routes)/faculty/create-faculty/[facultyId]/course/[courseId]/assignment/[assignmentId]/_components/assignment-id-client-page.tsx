"use client";

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { Course, Assignment, Attachment } from "@prisma/client";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { AssignmentActions } from "./assignment-actions";
import { AssignmentTitleForm } from "./assignment-title-form";
import { AssignmentObjectiveForm } from "./assignment-objective-form";
import { AssignmentDescriptionForm } from "./assignment-description-form";

interface AssignmentIdPageClientProps {
  assignment: Assignment & { attachments: Attachment[] };
  course: Course;
  facultyId: string;
  courseId: string;
  assignmentId: string;
}

export default function AssignmentIdPageClient({
  assignment,
  course,
  facultyId,
  courseId,
  assignmentId,
}: AssignmentIdPageClientProps) {
  const requiredFields = [
    assignment.title,
    assignment.courseId,
    assignment.description,
    assignment.objective,
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
          label="This assignment is not published yet. You can continue editing it, but it won't be visible to students until you publish it."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${facultyId}/course/${courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course creation
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Assignment creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
                <span className="text-sm text-slate-700">
                  Course: {course.title}
                </span>
              </div>
              <AssignmentActions
                disabled={!isComplete}
                facultyId={facultyId}
                courseId={courseId}
                assignmentId={assignmentId}
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
              <AssignmentTitleForm
                initialData={{ title: assignment.title || "" }}
                facultyId={facultyId}
                courseId={courseId}
                assignmentId={assignmentId}
              />
              <AssignmentObjectiveForm
                initialData={{ objective: assignment.objective }}
                facultyId={facultyId}
                courseId={courseId}
                assignmentId={assignmentId}
              />
              <AssignmentDescriptionForm
                initialData={{ description: assignment.description }}
                facultyId={facultyId}
                courseId={courseId}
                assignmentId={assignmentId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}