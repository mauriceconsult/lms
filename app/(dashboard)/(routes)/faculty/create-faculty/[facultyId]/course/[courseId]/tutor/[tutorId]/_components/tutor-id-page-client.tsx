"use client";

import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,  
  File,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { TutorActions } from "./tutor-actions";
import { TutorTitleForm } from "./tutor-title-form";
import { TutorCourseForm } from "./tutor-course-form";
import { TutorDescriptionForm } from "./tutor-description-form";
import { TutorVideoForm } from "./tutor-video-form";
import { Tutor, Attachment, Course } from "@prisma/client";
import { TutorAttachmentForm } from "./tutor-attachment-form";

interface TutorIdPageClientProps {
  tutor: Tutor & {
    attachments: Attachment[];
  };
  course: Course[];
  facultyId: string;
  courseId: string;
  tutorId: string;
}

export default function TutorIdPageClient({
  tutor,
  course,
  facultyId,
  courseId,
  tutorId,
}: TutorIdPageClientProps) {
  const requiredFields = [
    tutor.title,
    tutor.courseId,
    tutor.objective,
    tutor.description,
    tutor.videoUrl,
  ];
  const optionalFields = [tutor.attachments.length > 0];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!tutor.isPublished && (
        <Banner
          variant="warning"
          label="This tutor is not published yet. You can publish it once you have completed all required fields."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation.
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
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
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
                <h2 className="text-xl">Customize your tutor</h2>
              </div>
            </div>
            <TutorTitleForm
              initialData={tutor}
              facultyId={facultyId}
              courseId={courseId}
              tutorId={tutor.id}
            />
            <TutorCourseForm
              initialData={tutor}
              tutorId={tutor.id}
              facultyId={facultyId}
              courseId={courseId}
              options={course.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <TutorDescriptionForm
              initialData={tutor}
              tutorId={tutor.id}
              facultyId={facultyId}
              courseId={courseId}
            />
            <TutorVideoForm
              initialData={tutor}
              tutorId={tutor.id}
              facultyId={facultyId}
              courseId={courseId}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <TutorAttachmentForm
                initialData={tutor}
                tutorId={tutor.id}
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
