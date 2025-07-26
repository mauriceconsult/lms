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
} from "@prisma/client";
import { FacultySidebarItem } from "./faculty-sidebar-item";

interface FacultySidebarProps {
  faculty: Faculty & {
    courses: (Course & {
      progressCount: number;
      courseNoticeboards: (CourseNoticeboard & {
        attachments: Attachment[];
      })[];
      tuitions: (Tuition & {
        attachments: Attachment[];
      })[];
      tutors: (Tutor & {
        attachments: Attachment[];
      })[];
      attachments: Attachment[];
      assignments: Assignment[];
    })[];
    courseworks: Coursework[];
    attachments: Attachment[];
    noticeboards: Noticeboard[];
  };
}

export const FacultySidebar = ({ faculty }: FacultySidebarProps) => {
  // Normalize amount for courses (if schema not updated)
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
              facultyId={normalizedFaculty.id}
            />
          ))
        ) : (
          <p className="px-6 py-2 text-sm text-gray-500">
            No published courses
          </p>
        )}
      </div>
    </div>
  );
};
