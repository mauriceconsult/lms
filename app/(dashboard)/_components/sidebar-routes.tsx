"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse Faculties",
    href: "/search",
  },
];
const facultyRoutes = [
  {
    icon: List,
    label: "Faculties",
    href: "/faculty/faculties",
  },
  {
    icon: Compass,
    label: "Browse Courses",
    href: "/faculty/create-faculty/${facultyId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/analytics",
  },
];
const courseRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/faculty/create-faculty/${facultyId}/course/courses",
  },
  {
    icon: Compass,
    label: "Browse Topics",
    href: "/faculty/create-faculty/${facultyId}/course/${courseId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/course/analytics",
  },
];
const tutorRoutes = [
  {
    icon: List,
    label: "Topics",
    href: "/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/tutors",
  }, 
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isFacultyPage = pathname?.includes("/faculty");
  const isCoursePage = pathname?.includes("/course");
  const isTutorPage = pathname?.includes("/tutor");
  let routes;
  if (isTutorPage) {
    routes = tutorRoutes;
  } else if (isCoursePage) {
    routes = courseRoutes;
  } else if (isFacultyPage) {
    routes = facultyRoutes;
  } else {
    routes = guestRoutes;
  }
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
