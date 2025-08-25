"use client";
import { useEffect } from "react";
import { Course } from "@prisma/client";

interface AdminCourseListProps {
  items: Course[];
  onEditAction: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminCourseList = ({
  items,
  onEditAction,
}: AdminCourseListProps) => {
  useEffect(() => {
    console.log("AdminCourseList items:", items);
  }, [items]);

  return (
    <div className="mt-2">
      {items.length === 0 ? (
        <p className="text-slate-500 italic">No courses available.</p>
      ) : (
        items.map((course) => (
          <div key={course.id} className="flex items-center gap-2 p-2 border-b">
            <span className="flex-1">{course.title}</span>
            <button
              onClick={() => onEditAction(course.id)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
};
