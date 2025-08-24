// app/(eduplat)/_components/course-card.tsx
import { Course, Tutor, Tuition, Admin } from "@prisma/client";
import Link from "next/link";

interface CourseCardProps {
  course: Course & {
    tutors: (Tutor & {
      course: Course | null;
      attachmentIds: { id: string }[];
    })[];
    userProgress: {
      id: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      isCompleted: boolean;
      courseId: string;
      tutorId: string | null;
      courseworkId: string | null;
      assignmentId: string | null;
      isEnrolled: boolean;
    }[];
    tuition?: Tuition;
    admin?: Admin;
    progress?: number;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="border p-4 rounded-md hover:bg-gray-100"
    >
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600">
        {course.description ?? "No description"}
      </p>
      <div className="mt-2">
        <span className="font-semibold">Progress:</span>{" "}
        {course.progress?.toFixed(2) ?? "0.00"}%
      </div>
      <div>
        <span className="font-semibold">Admin:</span>{" "}
        {course.admin?.title ?? "No Admin"}
      </div>
      <div>
        <span className="font-semibold">Payment Status:</span>{" "}
        {course.tuition?.isPaid ? "Paid" : "Not Paid"}
      </div>
    </Link>
  );
};
