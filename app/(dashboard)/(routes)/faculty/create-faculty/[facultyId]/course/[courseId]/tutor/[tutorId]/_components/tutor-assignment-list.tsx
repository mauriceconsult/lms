"use client";

import { Assignment } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {
  Grip,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface TutorAssignmentListProps {
  items: Assignment[];
  onEditAction: (id: string) => Promise<{ success: boolean; message: string }>;
  onReorderAction: (updateData: { id: string; position: number }[]) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export const TutorAssignmentList = ({
  items,
  onEditAction,
  onReorderAction,
}: TutorAssignmentListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [tutors, setAssignments] = useState<Assignment[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setAssignments(items);
  }, [items]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(tutors);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setAssignments(newItems);

    const bulkUpdateData = newItems.map((tutor, index) => ({
      id: tutor.id,
      position: index,
    }));

    const { success, message } = await onReorderAction(bulkUpdateData);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tutors">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tutors.map((tutor, index) => (
              <Draggable key={tutor.id} draggableId={tutor.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      tutor.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        tutor.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <span aria-label={`Assignment: ${tutor.title || tutor.id}`}>
                      {tutor.title || tutor.id}
                    </span>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          tutor.isPublished && "bg-sky-700"
                        )}
                      >
                        {tutor.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={async () => {
                          const { success, message } = await onEditAction(
                            tutor.id
                          );
                          if (!success) {
                            toast.error(message);
                          }
                        }}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        aria-label={`Edit tutor: ${tutor.title || tutor.id}`}
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
