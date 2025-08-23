"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseWithProgressWithAdmin } from "../types/course";
// import { CourseWithProgressWithAdmin } from "@/types/course";

interface SidebarItem {
  type: "course" | "tutorial";
  id: string;
  title: string;
  adminId?: string;
}

interface EduplatSidebarRoutesProps {
  courses: CourseWithProgressWithAdmin[];
}

export const EduplatSidebarRoutes = ({ courses }: EduplatSidebarRoutesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  if (!courses) {
    console.log(`[${new Date().toISOString()} EduplatSidebarRoutes] No courses provided`);
    return null;
  }

  const items: SidebarItem[] = [
    ...courses.map((course) => ({
      type: "course" as const,
      id: course.id,
      title: course.title,
      adminId: course.facultyId ?? undefined,
    })),
    ...courses.flatMap((course) =>
      course.tutors.map((tutor) => ({
        type: "tutorial" as const,
        id: tutor.id,
        title: tutor.title,
        adminId: course.facultyId ?? undefined,
      }))
    ),
  ];

  return (
    <div className="flex flex-col w-full">
      {items.length === 0 ? (
        <div className="px-6 text-sm text-gray-500">No courses or tutorials</div>
      ) : (
        items.map((item) => {
          const isCourse = item.type === "course";
          const href = isCourse
            ? item.adminId
              ? `/eduplat/admins/${item.adminId}/courses/${item.id}`
              : `/courses/${item.id}`
            : `/eduplat/admins/${item.adminId}/courses/${item.id}/tutorials/${item.id}`;
          const isActive = pathname === href;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-sm font-normal py-2 px-4 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
              } hover:bg-blue-50`}
              onClick={() => {
                console.log(
                  `[${new Date().toISOString()} EduplatSidebarRoutes] Navigating to ${href}`
                );
                router.push(href);
              }}
            >
              <span className="truncate">{item.title}</span>
              {!isCourse && <span className="ml-2 text-xs text-gray-500">(Tutorial)</span>}
            </Button>
          );
        })
      )}
    </div>
  );
};
