import { TuitionCard } from "@/components/tuition-card";
import { Course, Tuition } from "@prisma/client";

type TuitionWithCourse = Tuition & {
  course: Course | null;
  tuitions: { id: string }[];
};
interface TuitionsListProps {
  items: TuitionWithCourse[];
}
export const TuitionsList = ({ items }: TuitionsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TuitionCard
            key={item.id}
            id={item.id}
            title={item.title}
            tuitionsLength={0}
            tuition={""}
            // progress={null}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Tuitions found.
        </div>
      )}
    </div>
  );
};
