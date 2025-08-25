import { CourseWithProgressWithAdmin } from "@/actions/get-dashboard-courses";

interface EduplatSidebarProps {
  courses: CourseWithProgressWithAdmin[];
}

export const EduplatSidebar = ({ courses }: EduplatSidebarProps) => {
  // Limit to top N courses to reduce rendering
  const displayedCourses = courses.slice(0, 5); // Adjust as needed

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold p-4">My Courses</h2>
      <ul className="space-y-2 p-4">
        {displayedCourses.map((course) => (
          <li key={course.id}>
            <a href={`/courses/${course.id}`} className="text-sm">
              {course.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};