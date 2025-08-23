"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseWithProgressWithFaculty } from "@/types/course";

interface SidebarItem {
  type: "course" | "tutorial";
  id: string;
  title: string;
  facultyId?: string;
}

interface EduplatSidebarRoutesProps {
  courses: CourseWithProgressWithFaculty[];
}

export const EduplatSidebarRoutes = ({ courses }: EduplatSidebarRoutesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const items: SidebarItem[] = [
    ...courses.map((course) => ({
      type: "course" as const,
      id: course.id,
      title: course.title,
      facultyId: course.facultyId ?? undefined,
    })),
    ...courses.flatMap((course) =>
      course.tutors.map((tutor) => ({
        type: "tutorial" as const,
        id: tutor.id,
        title: tutor.title,
        facultyId: course.facultyId ?? undefined,
      }))
    ),
  ];

  return (
    <div className="flex flex-col w-full">
      {items.map((item) => {
        const isCourse = item.type === "course";
        const href = isCourse
          ? item.facultyId
            ? `/eduplat/faculties/${item.facultyId}/courses/${item.id}`
            : `/courses/${item.id}`
          : `/courses/${item.facultyId}/tutorials/${item.id}`;
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
      })}
    </div>
  );
};
