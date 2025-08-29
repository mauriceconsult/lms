"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { AdminIdSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/search/_components/adminId-search-input";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/search/_components/course-search-input";
import { CourseworkSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/coursework/[courseworkId]/search/_components/coursework-search-input";
import { TutorialSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/tutorial/[tutorialId]/search/_components/tutor-search-input";
import { AssignmentSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/tutorial/[tutorialId]/assignment/[assignmentId]/search/_components/assignment-search-input";
import { CourseCourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/course-coursenoticeboard/[course-coursenoticeboardId]/search/_components/course-coursenoticeboard-search-input";
import React from "react";
import ClientUserButton from "./client-user-button";
import { SearchInput } from "@/app/(dashboard)/(routes)/search/_components/search-input";
import { NoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/noticeboard/[noticeboardId]/search/_components/noticeboard-search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/courses");
  const isNoticeboardPage = pathname?.includes("/noticeboards");
  const isCourseworkPage = pathname?.includes("/courseworks");
  const isTutorialPage = pathname?.includes("/tutorials");
  const isAssignmentPage = pathname?.includes("/assignments");
  const isCourseNoticeboardPage = pathname?.includes("/course-coursenoticeboards");
  const isPayrollPage = pathname?.includes("/payrolls");
  const isSearchPage = pathname === "/search";

  const searchComponents: { [key: string]: React.ComponentType } = {
    "/search": SearchInput,
    "/admin/create-admin": AdminIdSearchInput,
    "/course": CourseSearchInput,
    "/noticeboard": NoticeboardSearchInput,
    "/coursework": CourseworkSearchInput,
    "/tutorial": TutorialSearchInput,
    "/assignment": AssignmentSearchInput,
    "/course-coursenoticeboard": CourseCourseNoticeboardSearchInput,
  };

  const activeSearchComponent = Object.keys(searchComponents).find((key) =>
    pathname?.includes(key)
  ) || (isSearchPage ? "/search" : null);

  return (
    <div className="flex items-center gap-x-4 w-full px-4">
      {(isAdminPage ||
        isCoursePage ||
        isTutorialPage ||
        isNoticeboardPage ||
        isCourseworkPage ||
        isAssignmentPage ||
        isPayrollPage ||
        isCourseNoticeboardPage ||
        isSearchPage) && (
        <div className="hidden md:block w-64">
          {activeSearchComponent && searchComponents[activeSearchComponent] ? (
            React.createElement(searchComponents[activeSearchComponent])
          ) : (
            isSearchPage && <SearchInput />
          )}
        </div>
      )}
      <div className="flex gap-x-2 ml-auto pr-4">
        {isAdminPage ||
        isCoursePage ||
        isTutorialPage ||
        isNoticeboardPage ||
        isCourseworkPage ||
        isAssignmentPage ||
        isPayrollPage ||
        isCourseNoticeboardPage ||
        isSearchPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/admins">
            <Button size="sm" variant="ghost">
              Admin
            </Button>
          </Link>
        )}
        <ClientUserButton />
      </div>
    </div>
  );
};

export default NavbarRoutes;
