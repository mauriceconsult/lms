// components/course-tutor-list.tsx
import { Tutor } from "@prisma/client";

interface CourseTutorListProps {
  items: Tutor[];
  onEditAction: (id: string) => Promise<unknown>;
}

export const CourseTutorList = ({
  items,
  onEditAction,
}: CourseTutorListProps) => {
  console.log("CourseTutorList items:", items); // Debug log
  return (
    <div className="mt-4">
      {items.length > 0 ? (
        items.map((tutor) => {
          if (!tutor.id) {
            console.error("Invalid tutor ID:", tutor); // Log invalid tutors
            return null; // Skip rendering
          }
          return (
            <div
              key={tutor.id}
              className="p-2 border-b cursor-pointer flex justify-between items-center"
              onClick={() => {
                console.log("Clicked tutor ID:", tutor.id); // Debug click
                onEditAction(tutor.id);
              }}
            >
              <span>{tutor.title}</span>
              {!tutor.isPublished && (
                <span className="text-sm text-slate-500">(Unpublished)</span>
              )}
            </div>
          );
        })
      ) : (
        <p>No tutorials available</p>
      )}
    </div>
  );
};
