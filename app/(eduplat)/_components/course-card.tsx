// import { CourseWithProgressWithAdmin } from "@/types/course";
import Link from "next/link";
import { CourseWithProgressWithAdmin } from "../types/course";

interface CourseCardProps {
  course: CourseWithProgressWithAdmin;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link
      href={`/eduplat/admins/${course.facultyId}/courses/${course.id}`}
      className="border rounded-lg p-4 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{course.title}</h3>
      {course.progress !== null && (
        <p className="text-sm text-gray-500">Progress: {Math.round(course.progress)}%</p>
      )}
      <p className="text-sm text-gray-500">Tutorials: {course.tutors.length}</p>
      {course.tuition && (
        <p className="text-sm text-gray-500">Amount: ${course.tuition.amount ?? "N/A"}</p>
      )}
      {course.admin && (
        <p className="text-sm text-gray-500">Admin: {course.admin.title}</p>
      )}
    </Link>
  );
};
