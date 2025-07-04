"use client";

import { TutorAssignment} from "@prisma/client";
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

interface AssignmentTutorAssignmentListProps {
  items: TutorAssignment[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const AssignmentTutorAssignmentList = ({
  items,
  onReorder,
  onEdit,
}: AssignmentTutorAssignmentListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [courseNoticeboards, setAssignmentTutorAssignment] = useState(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setAssignmentTutorAssignment(items);
  }, [items]);

  const onDragend = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(courseNoticeboards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedAssignmentTutorAssignment = items.splice(startIndex, endIndex + 1);

    setAssignmentTutorAssignment(items);
    const bulkUpdateData = updatedAssignmentTutorAssignment.map((courseNoticeboard) => ({
      id: courseNoticeboard.id,
      position: items.findIndex((item) => item.id === courseNoticeboard.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragend}>
      <Droppable droppableId="courseNoticeboards">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {courseNoticeboards.map((courseNoticeboard, index) => (
              <Draggable
                key={courseNoticeboard.id}
                draggableId="courseNoticeboard.id"
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      courseNoticeboard.isSubmitted &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        courseNoticeboard.isSubmitted &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {courseNoticeboard.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {courseNoticeboard.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          courseNoticeboard.isSubmitted && "bg-sky-700"
                        )}
                      >
                        {courseNoticeboard.isSubmitted ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(courseNoticeboard.id)}
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
