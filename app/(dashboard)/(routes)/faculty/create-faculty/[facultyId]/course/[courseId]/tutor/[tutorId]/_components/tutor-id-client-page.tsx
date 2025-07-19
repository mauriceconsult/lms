'use client';

import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/components/banner';
import { TutorActions } from './tutor-actions';
import { TutorTitleForm } from './tutor-title-form';
import { TutorCourseForm } from './tutor-course-form';
import { TutorObjectiveForm } from './tutor-objective-form';
import { TutorDescriptionForm } from './tutor-description-form';
import { TutorVideoForm } from './tutor-video-form';
import { Course, Tutor, MuxData, Attachment } from '@prisma/client';

interface TutorIdPageClientProps {
  tutor: Tutor & {
    muxData: MuxData | null;
    attachments: Attachment[];
  };
  course: Course;
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
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!tutor.isPublished && (
        <Banner
          variant="warning"
          label="This topic is not published yet. You can continue editing it, but it won't be visible to students until you publish it."
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
                <h1 className="text-2xl font-medium">Topic creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
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
                <h2 className="text-xl">Customize your topic</h2>
              </div>
              <TutorTitleForm
                initialData={{ title: tutor.title || "" }}
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
              />
              <TutorCourseForm
                initialData={{ courseId: tutor.courseId }}
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
                options={[{ label: course.title, value: course.id }]}
              />
              <TutorObjectiveForm
                initialData={{ objective: tutor.objective }}
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
              />
              <TutorDescriptionForm
                initialData={{ description: tutor.description }}
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <TutorVideoForm
                initialData={{ videoUrl: tutor.videoUrl, muxData: tutor.muxData }}
                facultyId={facultyId}
                courseId={courseId}
                tutorId={tutorId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
