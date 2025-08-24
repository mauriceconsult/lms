"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
// import { EduplatSidebarItem } from "./eduplat-sidebar-item";
import { usePathname, useParams } from "next/navigation";
import { EduplatSidebarItem } from "./eduplat-sidebar-item";

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

const adminRoutes = (eduplatId: string) => [
  {
    icon: List,
    label: "Admins",
    href: `/eduplats/${eduplatId}/admins`,
  },
  {
    icon: Compass,
    label: "Browse Admins",
    href: `/eduplats/${eduplatId}/admins/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/admins/analytics`,
  },
];

const courseRoutes = (eduplatId: string, courseId: string) => [
  {
    icon: List,
    label: "Courses",
    href: `/eduplats/${eduplatId}/courses`,
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

const tutorRoutes = (eduplatId: string, courseId: string) => [
  {
    icon: List,
    label: "Tutorials",
    href: `/eduplats/${eduplatId}/courses/${courseId}/tutors`,
  },
  {
    icon: Compass,
    label: "Browse Tutorials",
    href: `/eduplats/${eduplatId}/courses/${courseId}/tutors/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/courses/${courseId}/tutors/analytics`,
  },
];

const noticeboardRoutes = (eduplatId: string) => [
  {
    icon: List,
    label: "Noticeboards",
    href: `/eduplats/${eduplatId}/noticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Notices",
    href: `/eduplats/${eduplatId}/noticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/noticeboards/analytics`,
  },
];

const courseworkRoutes = (eduplatId: string) => [
  {
    icon: List,
    label: "Courseworks",
    href: `/eduplats/${eduplatId}/courseworks`,
  },
  {
    icon: Compass,
    label: "Browse Courseworks",
    href: `/eduplats/${eduplatId}/courseworks/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/courseworks/analytics`,
  },
];

const assignmentRoutes = (eduplatId: string, courseId: string) => [
  {
    icon: List,
    label: "Assignments",
    href: `/eduplats/${eduplatId}/courses/${courseId}/assignments`,
  },
  {
    icon: Compass,
    label: "Browse Assignments",
    href: `/eduplats/${eduplatId}/courses/${courseId}/assignments/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/courses/${courseId}/assignments/analytics`,
  },
];

const courseNoticeboardRoutes = (eduplatId: string, courseId: string) => [
  {
    icon: List,
    label: "Course Notices",
    href: `/eduplats/${eduplatId}/courses/${courseId}/courseNoticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Course Notices",
    href: `/eduplats/${eduplatId}/courses/${courseId}/courseNoticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/eduplats/${eduplatId}/courses/${courseId}/courseNoticeboards/analytics`,
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

export const EduplatSidebarRoutes = () => {
  const pathname = usePathname();
  const params = useParams<{ eduplatId: string; courseId: string }>();
  const isAdminPage = pathname?.includes("/admins");
  const isCoursePage = pathname?.includes("/courses");
  const isTutorPage = pathname?.includes("/tutors");
  const isNoticeboardPage = pathname?.includes("/noticeboards");
  const isCourseworkPage = pathname?.includes("/courseworks");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboards");
  const isAssignmentPage = pathname?.includes("/assignments");
  const isPayrollPage = pathname?.includes("/payroll");

  let routes;
  if (isTutorPage && params.eduplatId && params.courseId) {
    routes = tutorRoutes(params.eduplatId, params.courseId);
  } else if (isNoticeboardPage && params.eduplatId) {
    routes = noticeboardRoutes(params.eduplatId);
  } else if (isCourseNoticeboardPage && params.eduplatId && params.courseId) {
    routes = courseNoticeboardRoutes(params.eduplatId, params.courseId);
  } else if (isCourseworkPage && params.eduplatId) {
    routes = courseworkRoutes(params.eduplatId);
  } else if (isAssignmentPage && params.eduplatId && params.courseId) {
    routes = assignmentRoutes(params.eduplatId, params.courseId);
  } else if (isPayrollPage) {
    routes = payrollRoutes;
  } else if (isCoursePage && params.eduplatId && params.courseId) {
    routes = courseRoutes(params.eduplatId, params.courseId);
  } else if (isAdminPage && params.eduplatId) {
    routes = adminRoutes(params.eduplatId);
  } else {
    routes = guestRoutes;
  }

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <EduplatSidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
