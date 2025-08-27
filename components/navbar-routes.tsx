"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { AdminIdSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/search/_components/adminId-search-input";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/search/_components/course-search-input";
import { NoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/noticeboard/[noticeboardId]/search/_components/noticeboard-search-input";
import { CourseworkSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/coursework/[courseworkId]/search/_components/coursework-search-input";
import React, { FC, ReactElement } from "react";
import ClientUserButton from "./client-user-button";
import { TutorialSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/tutorial/[tutorialId]/search/_components/tutor-search-input";
import { AssignmentSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/tutorial/[tutorialId]/assignment/[assignmentId]/search/_components/assignment-search-input";
import { CourseCourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/course-coursenoticeboard/[course-coursenoticeboardId]/search/_components/course-coursenoticeboard-search-input";

type SearchInputComponent = FC<object>;

interface NavbarRoutesProps {
  adminId?: string;
  courseId?: string;
}

export const NavbarRoutes: FC<NavbarRoutesProps> = (): ReactElement => {
  const pathname: string | null = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/course");
  const isNoticeboardPage = pathname?.includes("/noticeboard");
  const isCourseworkPage = pathname?.includes("/coursework");
  const isTutorialPage = pathname?.includes("/tutor");
  const isAssignmentPage = pathname?.includes("/assignment");
  const isCourseNoticeboardPage = pathname?.includes("/coursenoticeboard");
  const isPayrollPage = pathname?.includes("/payroll");

  let isSearchPages: SearchInputComponent | undefined;
  if (isTutorialPage) {
    isSearchPages = TutorialSearchInput;
  } else if (isCoursePage) {
    isSearchPages = CourseSearchInput;
  } else if (isNoticeboardPage) {
    isSearchPages = NoticeboardSearchInput;
  } else if (isCourseworkPage) {
    isSearchPages = CourseworkSearchInput;
  } else if (isAssignmentPage) {
    isSearchPages = AssignmentSearchInput;
  } else if (isCourseNoticeboardPage) {
    isSearchPages = CourseCourseNoticeboardSearchInput;
    // } else if (isPayrollPage) {
    //   isSearch = PayrollSearchInput;
  } else if (isAdminPage) {
    isSearchPages = AdminIdSearchInput;
  }

  return (
    <>
      {(isAdminPage ||
        isCoursePage ||
        isTutorialPage ||
        isNoticeboardPage ||
        isCourseworkPage ||
        isAssignmentPage ||
        isPayrollPage ||
        isCourseNoticeboardPage) && (
        <div className="mt-16 hidden md:block">
          {isSearchPages && React.createElement(isSearchPages)}
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isAdminPage ||
        isCoursePage ||
        isTutorialPage ||
        isNoticeboardPage ||
        isCourseworkPage ||
        isAssignmentPage ||
        isPayrollPage ||
        isCourseNoticeboardPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/admins">
            <Button size="sm" variant="ghost">
              Admins
            </Button>
          </Link>
        )}
        <ClientUserButton />
      </div>
    </>
  );
};
