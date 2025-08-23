import { CourseWithProgressWithFaculty } from "@/types/course";
import Link from "next/link";

interface CoursesListProps {
  courses: CourseWithProgressWithFaculty[];
}

export const CoursesList = ({ courses }: CoursesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/eduplat/faculties/${course.facultyId}/courses/${course.id}`}
          className="border rounded-lg p-4 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold">{course.title}</h3>
          {course.progress !== null && (
            <p className="text-sm text-gray-500">Progress: {Math.round(course.progress)}%</p>
          )}
          <p className="text-sm text-gray-500">
            Tutorials: {course.tutors.length}
          </p>
          {course.tuition && (
            <p className="text-sm text-gray-500">
              Amount: ${course.tuition.amount ?? "N/A"}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
};
