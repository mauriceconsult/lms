"use client";

import { StudentProject} from "@prisma/client";
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

interface CourseworkStudentProjectListProps {
  items: StudentProject[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const CourseworkStudentProjectList = ({
  items,
  onReorder,
  onEdit,
}: CourseworkStudentProjectListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [courseworkStudentProjects, setCourseworkStudentProject] = useState(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setCourseworkStudentProject(items);
  }, [items]);

  const onDragend = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(courseworkStudentProjects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedCourseworkStudentProject = items.splice(startIndex, endIndex + 1);

    setCourseworkStudentProject(items);
    const bulkUpdateData = updatedCourseworkStudentProject.map((courseworkStudentProject) => ({
      id: courseworkStudentProject.id,
      position: items.findIndex((item) => item.id === courseworkStudentProject.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragend}>
      <Droppable droppableId="courseworkStudentProjects">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {courseworkStudentProjects.map((courseworkStudentProject, index) => (
              <Draggable
                key={courseworkStudentProject.id}
                draggableId="courseworkStudentProject.id"
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      courseworkStudentProject.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        courseworkStudentProject.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {courseworkStudentProject.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {courseworkStudentProject.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          courseworkStudentProject.isPublished && "bg-sky-700"
                        )}
                      >
                        {courseworkStudentProject.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(courseworkStudentProject.id)}
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
