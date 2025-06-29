import { AssignmentCard } from "@/components/assignment-card";
import { Course, Assignment } from "@prisma/client";

type AssignmentWithCourse = Assignment & {
  course: Course | null;
  assignments: { id: string }[];
};
interface AssignmentsListProps {
  items: AssignmentWithCourse[];
}
export const AssignmentsList = ({ items }: AssignmentsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <AssignmentCard
            key={item.id}
            id={item.id}
            title={item.title}
            assignmentsLength={0} assignment={""}
            // progress={null}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Assignments found.
        </div>
      )}
    </div>
  );
};
