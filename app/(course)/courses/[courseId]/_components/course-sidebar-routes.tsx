"use client";

import { Layout } from "lucide-react";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarRoutesProps {
  courseId?: string;
}

export const CourseSidebarRoutes = ({
  courseId,
}: CourseSidebarRoutesProps) => {
  const basePath =
    courseId && courseId !== "" ? `/courses/${courseId}` : "/course";

  const routes = [
    {
      icon: Layout,
      label: "Courses",
      href: `${basePath}/courses`,
    },
    {
      icon: Layout,
      label: "Assignments",
      href: `${basePath}/assignments`,
    },
    {
      icon: Layout,
      label: "Course Noticeboards",
      href: `${basePath}/course-noticeboards`,
    },    
  ];

  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <CourseSidebarItem
          key={`${route.href}-${index}`}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
