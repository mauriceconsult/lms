import { Course, Faculty, Tuition } from "@prisma/client";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string; title: string }[];
  progress: number | null;
  tuition: Tuition | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithFaculty[];
}

export function CoursesList({ items }: CoursesListProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard key={item.id} course={item} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
}
