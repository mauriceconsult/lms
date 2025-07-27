import { FacultyCard } from "@/components/faculty-card";
import { Course, Faculty } from "@prisma/client";

interface CourseWithFaculty extends Course {
  faculty: Faculty | null;
}

interface CoursesListProps {
  items: CourseWithFaculty[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <FacultyCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl ?? ""}
            description={item.description ?? ""}
            facultyTitle={item?.faculty?.title ?? ""} // Renamed to avoid 'faculty' prop error
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found.
        </div>
      )}
    </div>
  );
};
