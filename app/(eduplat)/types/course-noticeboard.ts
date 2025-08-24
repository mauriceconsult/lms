// app/(eduplat)/types/course-noticeboard.ts
import { Course, CourseNoticeboard } from "@prisma/client";

export type CourseNoticeboardWithCourse = CourseNoticeboard & {
  course: (Course & { courseNoticeboards: CourseNoticeboard[] }) | null;
};

export type CourseWithCourseNoticeboards = Course & {
  courseNoticeboards: CourseNoticeboard[];
};
