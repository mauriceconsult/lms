import { CourseworkCard } from "@/components/coursework-card";
import { Course, Coursework } from "@prisma/client";

type CourseworksWithCourse = Coursework & {
  course: Course | null;  
};
interface CourseworksListProps {
  items: CourseworksWithCourse[];
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
            course={item?.course?.title ?? ""}
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
