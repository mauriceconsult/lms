"use client";

import { Layout } from "lucide-react";
import { FacultySidebarItem } from "./faculty-sidebar-item";

interface FacultySidebarRoutesProps {
  facultyId?: string;
}

export const FacultySidebarRoutes = ({
  facultyId,
}: FacultySidebarRoutesProps) => {
  const basePath =
    facultyId && facultyId !== "" ? `/faculties/${facultyId}` : "/faculty";

  const routes = [
    {
      icon: Layout,
      label: "Courses",
      href: `${basePath}/courses`,
    },
    {
      icon: Layout,
      label: "Courseworks",
      href: `${basePath}/courseworks`,
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
    {
      icon: Layout,
      label: "Noticeboards",
      href: `${basePath}/noticeboards`,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <FacultySidebarItem
          key={`${route.href}-${index}`}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
