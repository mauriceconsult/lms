// components/AssignmentsList.tsx
import { AssignmentCard } from "@/components/assignment-card";
import { Assignment, Tutor } from "@prisma/client";

type AssignmentWithTutor = Assignment & {
  tutor: Tutor | null;
};

interface AssignmentsListProps {
  item: AssignmentWithTutor[];
}

export const AssignmentsList = ({ item }: AssignmentsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {item.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            description={assignment.description ?? ""}
            assignmentsLength={item.length} // Use actual length
            assignment={assignment.title} // Use assignment title
          />
        ))}
      </div>
      {item.length === 0 && <div>No Assignments found.</div>}
    </div>
  );
};
