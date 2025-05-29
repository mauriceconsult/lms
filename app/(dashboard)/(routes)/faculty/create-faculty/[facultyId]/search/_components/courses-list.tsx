import { Faculty, Course } from "@prisma/client";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string }[];
  progress: number | null;
};
interface CoursesListProps {
  items: CourseWithProgressWithFaculty[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
