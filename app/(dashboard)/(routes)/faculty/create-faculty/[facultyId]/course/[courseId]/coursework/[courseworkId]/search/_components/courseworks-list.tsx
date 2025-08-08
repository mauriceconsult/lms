import { CourseworkCard } from "@/components/coursework-card";
import { Faculty, Coursework } from "@prisma/client";

type CourseworksWithFaculty = Coursework & {
  faculty: Faculty | null;  
};
interface CourseworksListProps {
  items: CourseworksWithFaculty[];
}
export const CourseworksList = ({ items }: CourseworksListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseworkCard
            key={item.id}
            id={item.id}
            title={item.title}
            faculty={item?.faculty?.title ?? ""}
            tutorsLength={0} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Courseworks found.
        </div>
      )}
    </div>
  );
};
