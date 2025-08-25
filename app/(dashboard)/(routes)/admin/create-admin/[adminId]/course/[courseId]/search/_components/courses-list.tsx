import { Course } from "@prisma/client";

interface CoursesListProps {
  courses: Course[];
}

export const CoursesList = ({ courses }: CoursesListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {courses.map((course) => (
        <div key={course.id} className="p-4 border rounded-md">
          <h3 className="text-lg font-medium">{course.title}</h3>
          {/* Add other course details */}
        </div>
      ))}
    </div>
  );
};
