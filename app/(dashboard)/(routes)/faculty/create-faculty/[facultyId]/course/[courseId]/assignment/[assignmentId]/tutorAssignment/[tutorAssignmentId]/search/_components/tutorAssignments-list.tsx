import { TutorAssignmentCard } from "@/components/tutorAssignment-card";
import { Assignment, TutorAssignment } from "@prisma/client";

type TutorAssignmentsWithAssignment = TutorAssignment & {
  assignment: Assignment | null;  
};
interface TutorAssignmentsListProps {
  items: TutorAssignmentsWithAssignment[];
}
export const TutorAssignmentsList = ({ items }: TutorAssignmentsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TutorAssignmentCard
            key={item.id}
            id={item.id}
            title={item.title}
            assignment={item?.assignment?.title ?? ""}
            tutorAssignmentsLength={0} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No TutorAssignments found.
        </div>
      )}
    </div>
  );
};
