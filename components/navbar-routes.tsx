// components/NavbarRoutes.tsx
"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { AdminIdSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/search/_components/adminId-search-input";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/search/_components/course-search-input";
import { NoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/noticeboard/[noticeboardId]/search/_components/noticeboard-search-input";
import { CourseworkSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/coursework/[courseworkId]/search/_components/coursework-search-input";
// import { PayrollSearchInput } from "@/app/(dashboard)/(routes)/payroll/create-payroll/[payrollId]/search/_components/payroll-search-input";
import { CourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/course-course-noticeboard/[course-course-noticeboardId]/search/_components/course-course-noticeboard-search-input";
// import { ClientUserButton } from "@/components/ClientUserButton";
import React, { FC, ReactElement } from "react";
import ClientUserButton from "./client-user-button";

type SearchInputComponent = FC<object>;

interface NavbarRoutesProps {
  adminId?: string;
  courseId?: string;
}

export const NavbarRoutes: FC<NavbarRoutesProps> = ({ adminId, courseId }): ReactElement => {
  const pathname: string | null = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/course");
  const isNoticeboardPage = pathname?.includes("/noticeboard");
  const isCourseworkPage = pathname?.includes("/coursework");
  const isTutorPage = pathname?.includes("/tutor");
  const isAssignmentPage = pathname?.includes("/assignment");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboard");
  const isPayrollPage = pathname?.includes("/payroll");

  let isSearchPages: SearchInputComponent | undefined;
  if (isTutorPage) {
    // isSearchPages = TutorSearchInput; // Uncomment when available
  } else if (isCoursePage) {
    isSearchPages = CourseSearchInput;
  } else if (isNoticeboardPage) {
    isSearchPages = NoticeboardSearchInput;
  } else if (isCourseworkPage) {
    isSearchPages = CourseworkSearchInput;
  } else if (isAssignmentPage) {
    // isSearchPages = AssignmentSearchInput; // Uncomment when available
  } else if (isCourseNoticeboardPage) {
    isSearchPages = CourseNoticeboardSearchInput;
  // } else if (isPayrollPage) {
  //   isSearch = PayrollSearchInput;
  } else if (isAdminPage) {
    isSearchPages = AdminIdSearchInput;
  }

  return (
    <>
      {(isAdminPage ||
        isCoursePage ||
        isTutorPage ||
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
        isTutorPage ||
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
        <Link href="/payroll/payrolls">
          <Button size="sm" variant="ghost">
            Payrolls
          </Button>
        </Link>
        {adminId && (
          <Link href={`/admin/create-admin/${adminId}/course/courses`}>
            <Button size="sm" variant="ghost">
              Courses
            </Button>
          </Link>
        )}
        {adminId && courseId && (
          <Link href={`/admin/create-admin/${adminId}/course/${courseId}/tutor/tutors`}>
            <Button size="sm" variant="ghost">
              Tutorials
            </Button>
          </Link>
        )}
        {adminId && (
          <Link href={`/admin/create-admin/${adminId}/noticeboard/noticeboards`}>
            <Button size="sm" variant="ghost">
              Admin Notices
            </Button>
          </Link>
        )}
        {adminId && (
          <Link href={`/admin/create-admin/${adminId}/coursework/courseworks`}>
            <Button size="sm" variant="ghost">
              Courseworks
            </Button>
          </Link>
        )}
        {adminId && courseId && (
          <Link href={`/admin/create-admin/${adminId}/course/${courseId}/courseNoticeboard/courseNoticeboards`}>
            <Button size="sm" variant="ghost">
              Course Notices
            </Button>
          </Link>
        )}
        {adminId && courseId && (
          <Link href={`/admin/create-admin/${adminId}/course/${courseId}/assignment/assignments`}>
            <Button size="sm" variant="ghost">
              Assignments
            </Button>
          </Link>
        )}
        <ClientUserButton />
      </div>
    </>
  );
};