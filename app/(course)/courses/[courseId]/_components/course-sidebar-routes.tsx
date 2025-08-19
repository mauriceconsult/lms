"use client";

import { FC } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProgressCount {
  course: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  tutor: {
    id: string;
    title: string | null;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          tutorId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  coursework: {
    id: string;
    title: string;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          courseworkId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  assignment: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          assignmentId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  attachments: { id: string; url: string }[] | null;
}

interface CourseSidebarRoutesProps {
  course: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    facultyId?: string | null;
    tutors: {
      id: string;
      title: string | null;
      userProgress: {
        id: string;
        userId: string;
        courseId: string;
        tutorId?: string | null;
        courseworkId?: string | null;
        assignmentId?: string | null;
        isCompleted: boolean;
        isEnrolled: boolean;
      }[];
    }[];
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId?: string | null;
      courseworkId?: string | null;
      assignmentId?: string | null;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
  };
  progressCount: ProgressCount;
}

const CourseSidebarRoutes: FC<CourseSidebarRoutesProps> = ({
  course,
  progressCount,
}) => {
  const params = useParams<{ courseId: string }>();

  // Calculate progress percentage, excluding course.userProgress
  const totalItems = [
    ...(progressCount.tutor?.userProgress || []),
    ...(progressCount.coursework?.userProgress || []),
    ...(progressCount.assignment?.userProgress || []),
  ].length;
  const completedItems = [
    ...(progressCount.tutor?.userProgress || []),
    ...(progressCount.coursework?.userProgress || []),
    ...(progressCount.assignment?.userProgress || []),
  ].filter((p) => p.isCompleted).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  console.log(`[${new Date().toISOString()} CourseSidebarRoutes] Rendering:`, {
    courseId: course.id,
    title: course.title,
    tutors: course.tutors.map((t) => ({
      id: t.id,
      title: t.title,
      userProgress: t.userProgress.map((up) => ({
        id: up.id,
        isCompleted: up.isCompleted,
        isEnrolled: up.isEnrolled,
      })),
    })),
    progressPercentage,
    progressCount: {
      course: progressCount.course
        ? { id: progressCount.course.id, title: progressCount.course.title }
        : null,
      tutor: progressCount.tutor
        ? { id: progressCount.tutor.id, title: progressCount.tutor.title }
        : null,
      coursework: progressCount.coursework
        ? {
            id: progressCount.coursework.id,
            title: progressCount.coursework.title,
          }
        : null,
      assignment: progressCount.assignment
        ? {
            id: progressCount.assignment.id,
            title: progressCount.assignment.title,
          }
        : null,
      attachments:
        progressCount.attachments?.map((a) => ({ id: a.id, url: a.url })) || [],
    },
  });

  return (
    <div className="flex flex-col space-y-2 p-4">
      <Link
        href={`/courses/${params.courseId}`}
        className="text-sm font-medium text-gray-700 hover:text-blue-600"
      >
        Overview
      </Link>
      {course.tutors && Array.isArray(course.tutors) ? (
        course.tutors.map((tutor) => (
          <div key={tutor.id} className="space-y-1">
            <Link
              href={`/courses/${params.courseId}/tutor/${tutor.id}`}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {tutor.title || `Tutorial ${tutor.id}`}
            </Link>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500">No tutorials available</p>
      )}
      <p className="text-xs text-gray-500">Progress: {progressPercentage}%</p>
    </div>
  );
};

export default CourseSidebarRoutes;
