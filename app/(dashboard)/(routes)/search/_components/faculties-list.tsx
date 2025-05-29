import { School, Faculty } from "@prisma/client";

type FacultyWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};
interface FacultiesListProps {
  items: FacultyWithSchool[];
}
export const FacultiesList = ({ items }: FacultiesListProps) => {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
