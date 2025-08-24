// app/(eduplat)/types/course.ts
import { Course, Tutor, Tuition, UserProgress, Admin } from "@prisma/client";

export type CourseWithProgressWithAdmin = Course & {
  tutors: (Tutor & {
    course: Course | null;
    attachmentIds: { id: string }[];
  })[];
  userProgress: UserProgress[];
  tuition?: Tuition;
  admin?: Admin; // Changed from 'faculty' to 'admin'
  progress?: number;
};
