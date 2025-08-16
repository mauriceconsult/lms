import {
    Assignment,
    Tutor,
    // Submission
} from "@prisma/client";

export type AssignmentWithTutor = Assignment & {
  tutor: Tutor | null;
//   submissions: Submission[];
};
