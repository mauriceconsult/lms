import { TutorCard } from "@/components/tutor-card";
import { Course, Tutor } from "@prisma/client";

type TutorWithProgressWithCourse = Tutor & {
  course: Course | null;
  tutors: { id: string }[];
  // progress: number | null;
};
interface TutorsListProps {
  items: TutorWithProgressWithCourse[];
}
export const TutorsList = ({ items }: TutorsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TutorCard
            key={item.id}
            id={item.id}
            title={item.title}
            course={item?.course?.title ?? ""}
            // progress={item.progress}
            tutorsLength={0}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Tutors found.
        </div>
      )}
    </div>
  );
};
