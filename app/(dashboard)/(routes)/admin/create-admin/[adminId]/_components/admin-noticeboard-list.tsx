"use client";

import { Noticeboard } from "@prisma/client";
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
import toast from "react-hot-toast";

interface AdminNoticeboardListProps {
  items: Noticeboard[];
  onReorderAction: (
    updateData: { id: string; position: number }[]
  ) => Promise<{ success: boolean; message: string }>;
  onEditAction: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminNoticeboardList = ({
  items,
  onReorderAction,
  onEditAction,
}: AdminNoticeboardListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [courses, setNoticeboards] = useState<Noticeboard[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setNoticeboards(items);
  }, [items]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(courses);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setNoticeboards(newItems);

    const bulkUpdateData = newItems.map((course, index) => ({
      id: course.id,
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
      <Droppable droppableId="courses">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {courses.map((course, index) => (
              <Draggable
                key={course.id}
                draggableId={course.id} // Fixed: Use actual course ID
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
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          course.isPublished && "bg-sky-700"
                        )}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={async () => {
                          const { success, message } = await onEditAction(
                            course.id
                          );
                          if (!success) {
                            toast.error(message);
                          }
                        }}
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
