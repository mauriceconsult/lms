"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Tutor, CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";

interface SidebarRoutesProps {
  items: Array<
    | { type: "course"; id: string; title: string; facultyId?: string }
    | { type: "tutor"; id: string; title: string; isFree: boolean | null; courseId: string; isEnrolled: boolean }
  >;
}

export const SidebarRoutes = ({ items }: SidebarRoutesProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-2 p-4">
      {items.map((item) => {
        const isActive =
          item.type === "course"
            ? pathname === `/faculties/${item.facultyId}/courses/${item.id}`
            : pathname.includes(`/courses/${item.courseId}`) && pathname.includes(`tutorId=${item.id}`);
        const isLocked = item.type === "tutor" && !(item.isFree ?? false) && !item.isEnrolled;
        const href =
          item.type === "course"
            ? `/faculties/${item.facultyId}/courses/${item.id}`
            : isLocked
            ? "#"
            : `/courses/${item.courseId}?tutorId=${item.id}`;

        return (
          <Link
            key={item.id}
            href={href}
            className={`block p-2 rounded-md text-sm sm:text-base ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : isLocked
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-900"
            }`}
            onClick={() =>
              isLocked
                ? console.log(`[${new Date().toISOString()} SidebarRoutes] Locked ${item.type} clicked: ${item.id}`)
                : console.log(`[${new Date().toISOString()} SidebarRoutes] Navigating to ${item.type}: ${item.id}`)
            }
          >
            <div className="flex items-center justify-between">
              <span>{item.title}</span>
              {item.type === "tutor" &&
                ((item.isFree ?? false) ? (
                  <span className="text-green-500 text-xs sm:text-sm">(Free)</span>
                ) : isLocked ? (
                  <span className="text-red-500 text-xs sm:text-sm">(Locked)</span>
                ) : (
                  <span className="text-blue-500 text-xs sm:text-sm">(Unlocked)</span>
                ))}
            </div>
          </Link>
        );
      })}
      {items.length === 0 && (
        <div className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
          No items found.
        </div>
      )}
    </div>
  );
};
