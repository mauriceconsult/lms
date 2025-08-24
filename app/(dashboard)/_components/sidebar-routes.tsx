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

const adminRoutes = (adminId: string) => [
  {
    icon: List,
    label: "Admins",
    href: `/admins/${adminId}`,
  },
  {
    icon: Compass,
    label: "Browse Admins",
    href: `/admins/${adminId}/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/analytics`,
  },
];

const courseRoutes = (adminId: string, courseId: string) => [
  {
    icon: List,
    label: "Courses",
    href: `/admins/${adminId}/courses`,
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

const tutorRoutes = (adminId: string, courseId: string) => [
  {
    icon: List,
    label: "Tutorials",
    href: `/admins/${adminId}/courses/${courseId}/tutors`,
  },
  {
    icon: Compass,
    label: "Browse Tutorials",
    href: `/admins/${adminId}/courses/${courseId}/tutors/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/courses/${courseId}/tutors/analytics`,
  },
];

const noticeboardRoutes = (adminId: string) => [
  {
    icon: List,
    label: "Noticeboards",
    href: `/admins/${adminId}/noticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Admin Notices",
    href: `/admins/${adminId}/noticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/noticeboards/analytics`,
  },
];

const courseworkRoutes = (adminId: string) => [
  {
    icon: List,
    label: "Courseworks",
    href: `/admins/${adminId}/courseworks`,
  },
  {
    icon: Compass,
    label: "Browse Courseworks",
    href: `/admins/${adminId}/courseworks/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/courseworks/analytics`,
  },
];

const assignmentRoutes = (adminId: string, courseId: string) => [
  {
    icon: List,
    label: "Assignments",
    href: `/admins/${adminId}/courses/${courseId}/assignments`,
  },
  {
    icon: Compass,
    label: "Browse Assignments",
    href: `/admins/${adminId}/courses/${courseId}/assignments/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/courses/${courseId}/assignments/analytics`,
  },
];

const courseNoticeboardRoutes = (adminId: string, courseId: string) => [
  {
    icon: List,
    label: "Course Notices",
    href: `/admins/${adminId}/courses/${courseId}/courseNoticeboards`,
  },
  {
    icon: Compass,
    label: "Browse Course Notices",
    href: `/admins/${adminId}/courses/${courseId}/courseNoticeboards/search`,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: `/admins/${adminId}/courses/${courseId}/courseNoticeboards/analytics`,
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
  const params = useParams<{ adminId: string; courseId: string }>();
  const isAdminPage = pathname?.includes("/admins");
  const isCoursePage = pathname?.includes("/courses");
  const isTutorPage = pathname?.includes("/tutors");
  const isNoticeboardPage = pathname?.includes("/noticeboards");
  const isCourseworkPage = pathname?.includes("/courseworks");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboards");
  const isAssignmentPage = pathname?.includes("/assignments");
  const isPayrollPage = pathname?.includes("/payroll");

  let routes;
  if (isTutorPage && params.adminId && params.courseId) {
    routes = tutorRoutes(params.adminId, params.courseId);
  } else if (isNoticeboardPage && params.adminId) {
    routes = noticeboardRoutes(params.adminId);
  } else if (isCourseNoticeboardPage && params.adminId && params.courseId) {
    routes = courseNoticeboardRoutes(params.adminId, params.courseId);
  } else if (isCourseworkPage && params.adminId) {
    routes = courseworkRoutes(params.adminId);
  } else if (isAssignmentPage && params.adminId && params.courseId) {
    routes = assignmentRoutes(params.adminId, params.courseId);
  } else if (isPayrollPage) {
    routes = payrollRoutes;
  } else if (isCoursePage && params.adminId && params.courseId) {
    routes = courseRoutes(params.adminId, params.courseId);
  } else if (isAdminPage && params.adminId) {
    routes = adminRoutes(params.adminId);
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
