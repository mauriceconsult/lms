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
    label: "Browse",
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
    label: "Browse Faculties",
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
    label: "Browse Courses",
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
    icon: Compass,
    label: "Browse Topics",
    href: "/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/analytics",
  },
];
const noticeboardRoutes = [
  {
    icon: List,
    label: "Noticeboards",
    href: "/faculty/create-faculty/${facultyId}/noticeboard/noticeboards",
  },
  {
    icon: Compass,
    label: "Browse Faculty Noticeboards",
    href: "/faculty/create-faculty/${facultyId}/noticeboard/${noticeboardId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/noticeboard/analytics",
  },
];
const courseworkRoutes = [
  {
    icon: List,
    label: "Courseworks",
    href: "/faculty/create-faculty/${facultyId}/coursework/courseworks",
  },
  {
    icon: Compass,
    label: "Browse Courseworks",
    href: "/faculty/create-faculty/${facultyId}/coursework/${courseworkId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/coursework/analytics",
  },
];
const assignmentRoutes = [
  {
    icon: List,
    label: "Assignments",
    href: "/faculty/create-faculty/${facultyId}/assignment/assignments",
  },
  {
    icon: Compass,
    label: "Browse Assignments",
    href: "/faculty/create-faculty/${facultyId}/assignment/${assignmentId}/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/faculty/create-faculty/${facultyId}/assignment/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isFacultyPage = pathname?.includes("/faculty");
  const isCoursePage = pathname?.includes("/course");
  const isTutorPage = pathname?.includes("/tutor");
  const isNoticeboardPage = pathname?.includes("/noticeboard");
  const isCourseworkPage = pathname?.includes("/coursework");
  const isAssignmentPage = pathname?.includes("/assignment");
  let routes;
  if (isTutorPage) {
    routes = tutorRoutes;
  } else if (isCoursePage) {
    routes = courseRoutes;
  } else if (isNoticeboardPage) {
    routes = noticeboardRoutes;
  } else if (isCourseworkPage) {
    routes = courseworkRoutes;
  } else if (isAssignmentPage) {
    routes = assignmentRoutes;
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
