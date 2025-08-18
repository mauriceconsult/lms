"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname, useParams } from "next/navigation";

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

const facultyRoutes = (facultyId: string) => [
  {
    icon: List,
    label: "Faculties",
    href: `/faculties/${facultyId}`,
  },
  {
    icon: Compass,
    label: "Browse Faculties",
    href: `/faculties/${facultyId}/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/analytics`,
  },
];

const courseRoutes = (facultyId: string, courseId: string) => [
  {
    icon: List,
    label: "Courses",
    href: `/faculties/${facultyId}/courses`,
  },
  {
    icon: Compass,
    label: "Browse Courses",
    href: `/courses/${courseId}/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/courses/${courseId}/analytics`,
  },
];

const tutorRoutes = (facultyId: string, courseId: string) => [
  {
    icon: List,
    label: "Topics",
    href: `/faculties/${facultyId}/courses/${courseId}/tutors`,
  },
  {
    icon: Compass,
    label: "Browse Topics",
    href: `/faculties/${facultyId}/courses/${courseId}/tutors/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/courses/${courseId}/tutors/analytics`,
  },
];

const noticeboardRoutes = (facultyId: string) => [
  {
    icon: List,
    label: "Noticeboards",
    href: `/faculties/${facultyId}/noticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Faculty Notices",
    href: `/faculties/${facultyId}/noticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/noticeboards/analytics`,
  },
];

const courseworkRoutes = (facultyId: string) => [
  {
    icon: List,
    label: "Courseworks",
    href: `/faculties/${facultyId}/courseworks`,
  },
  {
    icon: Compass,
    label: "Browse Courseworks",
    href: `/faculties/${facultyId}/courseworks/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/courseworks/analytics`,
  },
];

const assignmentRoutes = (facultyId: string, courseId: string) => [
  {
    icon: List,
    label: "Assignments",
    href: `/faculties/${facultyId}/courses/${courseId}/assignments`,
  },
  {
    icon: Compass,
    label: "Browse Assignments",
    href: `/faculties/${facultyId}/courses/${courseId}/assignments/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/courses/${courseId}/assignments/analytics`,
  },
];

const courseNoticeboardRoutes = (facultyId: string, courseId: string) => [
  {
    icon: List,
    label: "Course Notices",
    href: `/faculties/${facultyId}/courses/${courseId}/courseNoticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Course Notices",
    href: `/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/analytics`,
  },
];

const payrollRoutes = [
  {
    icon: List,
    label: "Payrolls",
    href: "/payroll/payrolls",
  },
  {
    icon: Compass,
    label: "Browse Payrolls",
    href: "/payroll/payrolls/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/payroll/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const params = useParams<{ facultyId: string; courseId: string }>();
  const isFacultyPage = pathname?.includes("/faculties");
  const isCoursePage = pathname?.includes("/courses");
  const isTutorPage = pathname?.includes("/tutors");
  const isNoticeboardPage = pathname?.includes("/noticeboards");
  const isCourseworkPage = pathname?.includes("/courseworks");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboards");
  const isAssignmentPage = pathname?.includes("/assignments");
  const isPayrollPage = pathname?.includes("/payroll");

  let routes;
  if (isTutorPage && params.facultyId && params.courseId) {
    routes = tutorRoutes(params.facultyId, params.courseId);
  } else if (isNoticeboardPage && params.facultyId) {
    routes = noticeboardRoutes(params.facultyId);
  } else if (isCourseNoticeboardPage && params.facultyId && params.courseId) {
    routes = courseNoticeboardRoutes(params.facultyId, params.courseId);
  } else if (isCourseworkPage && params.facultyId) {
    routes = courseworkRoutes(params.facultyId);
  } else if (isAssignmentPage && params.facultyId && params.courseId) {
    routes = assignmentRoutes(params.facultyId, params.courseId);
  } else if (isPayrollPage) {
    routes = payrollRoutes;
  } else if (isCoursePage && params.facultyId && params.courseId) {
    routes = courseRoutes(params.facultyId, params.courseId);
  } else if (isFacultyPage && params.facultyId) {
    routes = facultyRoutes(params.facultyId);
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
