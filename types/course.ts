import { Course, Faculty, Tuition } from "@prisma/client";

export interface Tutor {
  id: string;
  title: string;
  isFree: boolean | null;
  position: number;
  playbackId: string | null;
}

export interface CourseWithProgressWithFaculty extends Course {
  faculty: Faculty | null;
  tutors: Tutor[];
  progress: number | null;
  tuition: (Omit<Tuition, "amount"> & { amount: string | null }) | null;
  userProgress: {
    isCompleted: boolean;
    isEnrolled: boolean;
    tutorId: string | null;
  }[];
};