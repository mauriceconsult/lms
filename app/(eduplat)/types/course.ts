import { Course, Faculty, Tuition } from "@prisma/client";

export interface Tutorial {
  id: string;
  title: string;
  isFree: boolean | null;
  position: number;
  playbackId: string | null;
}

export interface CourseWithProgressWithAdmin extends Course {
  admin: Faculty | null; // Alias Faculty as Admin
  tutors: Tutorial[];
  progress: number | null;
  tuition: (Omit<Tuition, "amount"> & { amount: string | null }) | null;
  userProgress: {
    isCompleted: boolean;
    isEnrolled: boolean;
    tutorId: string | null;
  }[];
}
