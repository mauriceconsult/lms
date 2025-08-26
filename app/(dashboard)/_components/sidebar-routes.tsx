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

const adminRoutes = [
  {
    icon: List,
    label: "Admin",
    href: "/admin",
  },
  {
    icon: Compass,
    label: "Browse Admins",
    href: "/admin/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/analytics",
  },
];

const courseRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/admin/course/courses",
  },
  {
    icon: Compass,
    label: "Browse Courses",
    href: "/admin/course/courses/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/course/analytics",
  },
];

const tutorialRoutes = [
  {
    icon: List,
    label: "Tutorials",
    href: "/admin/course/tutorial/tutorials",
  },
  {
    icon: Compass,
    label: "Browse Tutorials",
    href: "/admin/course/tutorial/tutorials/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/course/tutorials/analytics",
  },
];

const noticeboardRoutes = [
  {
    icon: List,
    label: "Noticeboards",
    href: "/admin/noticeboard",
  },
  {
    icon: Compass,
    label: "Browse Admin Notices",
    href: "/admin/noticeboard/noticeboards/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/noticeboard/analytics",
  },
];

const courseworkRoutes = [
  {
    icon: List,
    label: "Courseworks",
    href: "/admin/coursework/courseworks",
  },
  {
    icon: Compass,
    label: "Browse Courseworks",
    href: "/admin/coursework/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/coursework/analytics",
  },
];

const assignmentRoutes = [
  {
    icon: List,
    label: "Assignments",
    href: "/admin/course/tutorial/assignment/assignments",
  },
  {
    icon: Compass,
    label: "Browse Assignments",
    href: "/admins/course/tutorial/assignments/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admins/course/tutorial/assignments/analytics",
  },
];

const coursenoticeboardRoutes = [
  {
    icon: List,
    label: "Course Notices",
    href: "/admins/course/course-coursenoticeboard/course-coursenoticeboards",
  },
  {
    icon: Compass,
    label: "Browse Course Notices",
    href: "/admins/course/course-coursenoticeboard/course-coursenoticeboards/search",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admins/courses/course-coursenoticeboards/analytics",
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
  const isAdminPage = pathname?.includes("/admin");
  const isCoursePage = pathname?.includes("/course");
  const isTutorPage = pathname?.includes("/tutorial");
  const isNoticeboardPage = pathname?.includes("/noticeboard");
  const isCourseworkPage = pathname?.includes("/coursework");
  const isCourseNoticeboardPage = pathname?.includes(
    "/course-coursenoticeboard"
  );
  const isAssignmentPage = pathname?.includes("/assignment");
  const isPayrollPage = pathname?.includes("/payroll");

  let routes;
  if (isTutorPage) {
    routes = tutorialRoutes;
  } else if (isNoticeboardPage) {
    routes = noticeboardRoutes;
  } else if (isCourseNoticeboardPage) {
    routes = coursenoticeboardRoutes;
  } else if (isCourseworkPage) {
    routes = courseworkRoutes;
  } else if (isAssignmentPage) {
    routes = assignmentRoutes;
  } else if (isPayrollPage) {
    routes = payrollRoutes;
  } else if (isCoursePage) {
    routes = courseRoutes;
  } else if (isAdminPage) {
    routes = adminRoutes;
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


