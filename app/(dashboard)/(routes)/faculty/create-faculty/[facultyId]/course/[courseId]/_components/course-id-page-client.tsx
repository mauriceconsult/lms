'use client';

import { IconBadge } from '@/components/icon-badge';
import {
  ArrowLeft,
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/components/banner';
import { CourseActions } from './course-actions';
import { CourseTitleForm } from './course-title-form';
import { CourseFacultyForm } from './course-faculty-form';
import { CourseDescriptionForm } from './course-description-form';
import { CourseImageForm } from './course-image-form';
import { CourseAttachmentForm } from './course-attachment-form';
import { CourseTutorForm } from './course-tutor-form';
import { CourseCourseNoticeboardForm } from './course-courseNoticeboard-form';
import { CourseAssignmentForm } from './course-assignment-form';
import { CourseAmountForm } from './course-amount-form';
import { Course, Faculty, CourseNoticeboard, Attachment, Assignment, Tuition, Tutor } from '@prisma/client';

interface CourseIdPageClientProps {
  course: Course & {
    courseNoticeboards: CourseNoticeboard[];
    assignments: Assignment[];
    tuitions: Tuition[];
    tutors: Tutor[];
    attachments: Attachment[];
  };
  faculty: Faculty[];
  facultyId: string;
  courseId: string;
}

export default function CourseIdPageClient({
  course,
  faculty,
  facultyId,
  courseId,
}: CourseIdPageClientProps) {
  const requiredFields = [
    course.description,
    course.facultyId,
    course.imageUrl,
    course.amount,
    course.tutors.length > 0,
    course.assignments.length > 0,
  ];
  const optionalFields = [
    course.attachments.length > 0,
    course.courseNoticeboards.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published yet. You can publish it once you have completed all required fields."
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
                <h1 className="text-2xl font-medium">Course creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseActions
                disabled={!isComplete}
                facultyId={facultyId}
                courseId={courseId}
                isPublished={course.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>
            </div>
            <CourseTitleForm
              initialData={course}
              facultyId={course.facultyId || ''}
              courseId={course.id}
            />
            <CourseFacultyForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ''}
              options={faculty.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <CourseDescriptionForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ''}
            />
            <CourseImageForm
              initialData={course}
              courseId={course.id}
              facultyId={course.facultyId || ''}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your Course</h2>
              </div>
              <CourseAmountForm
                initialData={{ amount: course.amount ? Number(course.amount) : null }}
                courseId={course.id}
                facultyId={course.facultyId || ''}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <CourseAttachmentForm
                initialData={course}
                courseId={course.id}
                facultyId={course.facultyId || ''}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Topics</h2>
              </div>
              <CourseTutorForm
                initialData={course}
                facultyId={course.facultyId || ''}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Notices</h2>
              </div>
              <CourseCourseNoticeboardForm
                initialData={course}
                facultyId={course.facultyId || ''}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Assignments</h2>
              </div>
              <CourseAssignmentForm
                initialData={course}
                facultyId={course.facultyId || ''}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
