"use client";

import { Course } from "@prisma/client";
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

interface FacultyCourseListProps {
  items: Course[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const FacultyCourseList = ({
  items,
  onReorder,
  onEdit,
}: FacultyCourseListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [courses, setCourse] = useState(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setCourse(items);
  }, [items]);

  const onDragend = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedCourse = items.splice(startIndex, endIndex + 1);

    setCourse(items);
    const bulkUpdateData = updatedCourse.map((course) => ({
      id: course.id,
      position: items.findIndex((item) => item.id === course.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragend}>
      <Droppable droppableId="courses">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {courses.map((course, index) => (
              <Draggable
                key={course.id}
                draggableId="course.id"
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      course.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        course.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {course.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {course.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          course.isPublished && "bg-sky-700"
                        )}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(course.id)}
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
