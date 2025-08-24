import { FacultyCard } from "@/components/faculty-card";
import {
  Faculty,
  School
} from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];  
};
interface SchoolsListProps {
  item: FacultiesWithSchool[];
}

export const SchoolsList = ({ item }: SchoolsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {item.map((faculty) => (
          <FacultyCard
            key={faculty.id}
            id={faculty.id}
            title={faculty.title}
            imageUrl={faculty.imageUrl!}
            description={faculty.description ?? ""}
            school={faculty.school?.name ?? ""}
            role={null} />
        ))}
      </div>
      {item.length === 0 && <div>No Schools found.</div>}
    </div>
  );
};
