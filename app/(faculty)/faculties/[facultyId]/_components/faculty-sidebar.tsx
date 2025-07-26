"use client";

import { useEffect } from "react";
import {
  Faculty,
  Course,
  Coursework,
  Attachment,
  Noticeboard,
  Assignment,
  Tutor,
  Tuition,
  CourseNoticeboard,
  UserProgress,
} from "@prisma/client";
import { FacultySidebarItem } from "./faculty-sidebar-item";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface FacultySidebarProps {
  faculty: Faculty & {
    courses: (Course & {
      progressCount: number;
      courseNoticeboards: (CourseNoticeboard & { attachments: Attachment[] })[];
      tuitions: (Tuition & { attachments: Attachment[] })[];
      tutors: (Tutor & { attachments: Attachment[] })[];
      attachments: Attachment[];
      assignments: (Assignment & { progressCount: number })[];
    })[];
    courseworks: (Coursework & { progressCount: number })[];
    attachments: Attachment[];
    noticeboards: Noticeboard[];
    userProgress: UserProgress[];
  };
}

export const FacultySidebar = ({ faculty }: FacultySidebarProps) => {
  const { userId } = useAuth();
  const router = useRouter();

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  // Avoid rendering if no userId
  if (!userId) {
    return null;
  }

  // Normalize amount for display (compatible with Momo API string)
  const normalizedFaculty = {
    ...faculty,
    courses: faculty.courses.map((course) => ({
      ...course,
      amount:
        course.amount && !isNaN(parseFloat(course.amount))
          ? parseFloat(course.amount)
          : null,
    })),
  };

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{normalizedFaculty.title}</h2>
        <p className="text-sm text-gray-600">{normalizedFaculty.description}</p>
      </div>
      <div className="flex flex-col w-full">
        <h3 className="px-6 py-2 text-sm font-medium text-gray-500">Courses</h3>
        {normalizedFaculty.courses.length ? (
          normalizedFaculty.courses.map((course) => (
            <FacultySidebarItem
              key={course.id}
              id={course.id}
              label={course.title}
              facultyId={faculty.id}
            />
          ))
        ) : (
          <p className="px-6 py-2 text-sm text-gray-500">
            No published courses
          </p>
        )}
        <h3 className="px-6 py-2 text-sm font-medium text-gray-500">
          Courseworks
        </h3>
        {normalizedFaculty.courseworks.length ? (
          normalizedFaculty.courseworks.map((coursework) => (
            <div
              key={coursework.id}
              className="px-2 py-2 text-sm text-gray-700"
            >
              Coursework ID: {coursework.id} (Progress:{" "}
              {coursework.progressCount.toFixed(2)}%)
            </div>
          ))
        ) : (
          <p className="px-6 py-2 text-sm text-gray-500">No courseworks</p>
        )}
      </div>
    </div>
  );
};
