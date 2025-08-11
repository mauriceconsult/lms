// CourseSidebar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  tutors: { id: string; title: string }[];
  activeTutorId: string | null;
  facultyId: string;
  courseId: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  tutors,
  activeTutorId,
  facultyId,
  courseId,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTutorId = searchParams.get("tutorId") || activeTutorId;

  return (
    <div className="w-64 bg-slate-50 p-4 border-r h-screen fixed">
      <h2 className="text-lg font-medium mb-4">Tutors</h2>
      {tutors.length > 0 ? (
        <ul>
          {tutors.map((tutor) => (
            <li
              key={tutor.id}
              className={cn(
                "p-2 rounded-md cursor-pointer hover:bg-slate-200 transition",
                tutor.id === currentTutorId && "bg-slate-200 font-medium"
              )}
              onClick={() => {
                console.log(
                  `[${new Date().toISOString()} CourseSidebar] Navigating to tutor:`,
                  {
                    facultyId,
                    courseId,
                    tutorId: tutor.id,
                  }
                );
                router.push(
                  `/faculties/${facultyId}/courses/${courseId}/tutors/${tutor.id}`
                );
              }}
            >
              {tutor.title || "Untitled Tutor"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-700">No tutors available.</p>
      )}
    </div>
  );
};
