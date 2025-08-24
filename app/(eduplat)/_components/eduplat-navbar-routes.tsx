"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React, { FC, ReactElement } from "react";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/search/_components/course-search-input";
import { NoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/noticeboard/[noticeboardId]/search/_components/noticeboard-search-input";
import { CourseworkSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/coursework/[courseworkId]/search/_components/coursework-search-input";
import { AdminIdSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/search/_components/adminId-search-input";
import { CourseCourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/course-coursenoticeboard/[course-coursenoticeboardId]/search/_components/course-coursenoticeboard-search-input";
import ClientUserButton from "@/components/client-user-button";

type SearchInputComponent = FC<object>;

interface EduplatNavbarRoutesProps {
  eduplatId?: string;
  courseId?: string;
}

export const EduplatNavbarRoutes: FC<EduplatNavbarRoutesProps> = ({
  eduplatId,
  courseId,
}): ReactElement => {
  const pathname: string | null = usePathname();
  const isAdminPage = pathname?.startsWith("/eduplats/[eduplatId]/admins");
  const isCoursePage = pathname?.includes("/courses");
  const isNoticeboardPage = pathname?.includes("/noticeboards");
  const isCourseworkPage = pathname?.includes("/courseworks");
  const isTutorPage = pathname?.includes("/tutors");
  const isAssignmentPage = pathname?.includes("/assignments");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboards");
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
    isSearchPages = CourseCourseNoticeboardSearchInput;
  } else if (isPayrollPage) {
    // isSearchPages = PayrollSearchInput; // Uncomment when available
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
          <Link href={`/eduplats/${eduplatId}/admins`}>
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
        {eduplatId && (
          <Link href={`/eduplats/${eduplatId}/courses`}>
            <Button size="sm" variant="ghost">
              Courses
            </Button>
          </Link>
        )}
        {eduplatId && courseId && (
          <Link href={`/eduplats/${eduplatId}/courses/${courseId}/tutors`}>
            <Button size="sm" variant="ghost">
              Tutorials
            </Button>
          </Link>
        )}
        {eduplatId && (
          <Link href={`/eduplats/${eduplatId}/noticeboards`}>
            <Button size="sm" variant="ghost">
              Notices
            </Button>
          </Link>
        )}
        {eduplatId && (
          <Link href={`/eduplats/${eduplatId}/courseworks`}>
            <Button size="sm" variant="ghost">
              Courseworks
            </Button>
          </Link>
        )}
        {eduplatId && courseId && (
          <Link
            href={`/eduplats/${eduplatId}/courses/${courseId}/courseNoticeboards`}
          >
            <Button size="sm" variant="ghost">
              Course Notices
            </Button>
          </Link>
        )}
        {eduplatId && courseId && (
          <Link href={`/eduplats/${eduplatId}/courses/${courseId}/assignments`}>
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
