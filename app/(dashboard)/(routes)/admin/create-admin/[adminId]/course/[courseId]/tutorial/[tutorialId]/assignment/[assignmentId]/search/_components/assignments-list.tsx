import { AssignmentWithRelations } from "@/actions/get-assignments";
import { AssignmentCard } from "@/components/assignment-card";
// import { AssignmentWithRelations } from "@/app/(dashboard)/_actions/getAssignments";

interface AssignmentsListProps {
  items: AssignmentWithRelations[];
  courseId: string;
  adminId: string;
  tutorId: string | undefined;
}

export const AssignmentsList = ({ items, courseId, adminId, tutorId }: AssignmentsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            description={assignment.description ?? ""}
            courseId={courseId}
            adminId={adminId}
            tutorialId={tutorId}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-sm text-slate-500 italic">No assignments found.</div>
      )}
    </div>
  );
};
