"use client";

import { Tutor} from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseTutorListProps {
  items: Tutor[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const CourseTutorList = ({
  items,
  onReorder,
  onEdit,
}: CourseTutorListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [tutors, setCourseTutor] = useState(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setCourseTutor(items);
  }, [items]);

  const onDragend = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(tutors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedCourseTutor = items.splice(startIndex, endIndex + 1);

    setCourseTutor(items);
    const bulkUpdateData = updatedCourseTutor.map((tutor) => ({
      id: tutor.id,
      position: items.findIndex((item) => item.id === tutor.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragend}>
      <Droppable droppableId="tutors">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tutors.map((tutor, index) => (
              <Draggable
                key={tutor.id}
                draggableId="tutor.id"
                index={index}
              >
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
                        tutor.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {tutor.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {tutor.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          tutor.isPublished && "bg-sky-700"
                        )}
                      >
                        {tutor.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(tutor.id)}
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
