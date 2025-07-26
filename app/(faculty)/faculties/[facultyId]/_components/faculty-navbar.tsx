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

interface FacultyNavbarProps {
  faculty: Faculty & {
    courses: (Course & {
      progressCount: number;
      courseNoticeboards: (CourseNoticeboard & { attachments: Attachment[] })[];
      tuitions: (Tuition & { attachments: Attachment[] })[]; // Fixed: tuitions
      tutors: (Tutor & { attachments: Attachment[] })[];
      attachments: Attachment[];
      assignments: (Assignment & { progressCount: number })[]; // Corrected Assignment type
    })[];
    courseworks: (Coursework & { progressCount: number })[];
    attachments: Attachment[];
    noticeboards: Noticeboard[];
    userProgress: UserProgress[];
  };
}

export const FacultyNavbar = ({ faculty }: FacultyNavbarProps) => {
  return (
    <div className="h-[80px] flex items-center justify-between px-6 bg-white shadow">
      <h1>{faculty.title}</h1>
      <div>
        {faculty.courses.map((course) => (
          <div key={course.id}>
            {course.title} (Progress: {course.progressCount.toFixed(2)}%)
            {course.assignments.map((assignment) => (
              <div key={assignment.id} className="ml-4">
                Assignment ID: {assignment.id} (Progress:{" "}
                {assignment.progressCount.toFixed(2)}%)
              </div>
            ))}
          </div>
        ))}
        {faculty.courseworks.map((coursework) => (
          <div key={coursework.id}>
            Coursework ID: {coursework.id} (Progress:{" "}
            {coursework.progressCount.toFixed(2)}%)
          </div>
        ))}
      </div>
    </div>
  );
};
