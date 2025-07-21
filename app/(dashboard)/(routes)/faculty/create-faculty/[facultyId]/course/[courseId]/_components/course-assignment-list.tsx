"use client";

import { useState } from "react";
// import { DragDropContext, Droppable, Draggable, DropResult } from "react-dnd-html5-backend";
import { Assignment } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

type AssignmentWithProgress = Assignment & { isSubmitted: boolean };

interface CourseAssignmentListProps {
  items: AssignmentWithProgress[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const CourseAssignmentList = ({
  items,
  onReorder,
  onEdit,
}: CourseAssignmentListProps) => {
  const [assignments, setAssignments] = useState(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedAssignments = Array.from(assignments);
    const [reorderedItem] = updatedAssignments.splice(result.source.index, 1);
    updatedAssignments.splice(result.destination.index, 0, reorderedItem);

    setAssignments(updatedAssignments);

    const updateData = updatedAssignments.map((assignment, index) => ({
      id: assignment.id,
      position: index + 1,
    }));

    onReorder(updateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="assignments">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {assignments.map((assignment, index) => (
              <Draggable key={assignment.id} draggableId={assignment.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      assignment.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        assignment.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {assignment.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {assignment.isSubmitted ? (
                        <Badge className="bg-green-700">Submitted</Badge>
                      ) : (
                        <Badge className="bg-slate-700">Not Submitted</Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-slate-700",
                          assignment.isPublished && "bg-sky-700"
                        )}
                      >
                        {assignment.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(assignment.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};