export interface Tutor {
  id: string;
  title: string;
  isFree: boolean | null;
  position: number;
  playbackId: string | null;
}

export interface CourseWithProgressWithFaculty {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  position: number | null;
  isPublished: boolean;
  facultyId: string | null; // Changed to allow null
  faculty: {
    id: string;
    title: string;
    userId: string;
    description: string | null;
    imageUrl: string | null;
    position: number | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    schoolId: string | null;
  } | null;
  tutors: Tutor[];
  progress: number | null;
  tuition: {
    id: string;
    userId: string;
    courseId: string | null;
    amount: string | null;
    status: string | null;
    partyId: string | null;
    username: string | null;
    transactionId: string | null;
    isActive: boolean;
    isPaid: boolean;
    transId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  userProgress: {
    isCompleted: boolean;
    isEnrolled: boolean;
    tutorId: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
