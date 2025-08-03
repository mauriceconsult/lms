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
import { Grip } from "lucide-react"; // Removed Pencil
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface FacultyNoticeboardListProps {
  items: Noticeboard[];
  onReorderAction: (updateData: { id: string; position: number }[]) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export const FacultyNoticeboardList = ({
  items,
  onReorderAction,
}: FacultyNoticeboardListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [noticeboards, setNoticeboards] = useState<Noticeboard[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setNoticeboards(items);
  }, [items]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(noticeboards);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setNoticeboards(newItems);

    const bulkUpdateData = newItems.map((noticeboard, index) => ({
      id: noticeboard.id,
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
      <Droppable droppableId="noticeboards">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {noticeboards.map((noticeboard, index) => (
              <Draggable
                key={noticeboard.id}
                draggableId={noticeboard.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      noticeboard.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        noticeboard.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <span aria-label={`Noticeboard: ${noticeboard.title}`}>
                      {noticeboard.title}
                    </span>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          noticeboard.isPublished && "bg-sky-700"
                        )}
                      >
                        {noticeboard.isPublished ? "Published" : "Draft"}
                      </Badge>
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
