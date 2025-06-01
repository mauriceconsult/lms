import { FacultyCard } from "@/components/faculty-card";
import { School, Faculty } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};
interface FacultiesListProps {
  items: FacultiesWithSchool[];
}
export const FacultiesList = ({ items }: FacultiesListProps) => {
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
              school={item?.school?.name ?? ""}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No Faculties found.
          </div>
        )}
      </div>
  );
};
