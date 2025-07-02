"use client";

import { FacultyPayroll } from "@prisma/client";
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

interface PayrollFacultyPayrollListProps {
  items: FacultyPayroll[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const PayrollFacultyPayrollList = ({
  items,
  onReorder,
  onEdit,
}: PayrollFacultyPayrollListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [facultyPayrolls, setFacultyPayroll] = useState(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setFacultyPayroll(items);
  }, [items]);

  const onDragend = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(facultyPayrolls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedFacultyPayroll = items.splice(startIndex, endIndex + 1);

    setFacultyPayroll(items);
    const bulkUpdateData = updatedFacultyPayroll.map((facultyPayroll) => ({
      id: facultyPayroll.id,
      position: items.findIndex((item) => item.id === facultyPayroll.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragend}>
      <Droppable droppableId="facultyPayrolls">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {facultyPayrolls.map((facultyPayroll, index) => (
              <Draggable
                key={facultyPayroll.id}
                draggableId="facultyPayroll.id"
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      facultyPayroll.isPaid &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        facultyPayroll.isPaid &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {facultyPayroll.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {facultyPayroll.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          facultyPayroll.isPaid && "bg-sky-700"
                        )}
                      >
                        {facultyPayroll.isPaid ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(facultyPayroll.id)}
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
