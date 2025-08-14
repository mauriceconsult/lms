"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { FacultyIdSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/search/_components/facultyId-search-input";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/search/_components/course-search-input";
import { TutorSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/[tutorId]/search/_components/tutor-search-input";
import React, { FC, ReactElement } from "react";
import { NoticeboardSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/noticeboard/[noticeboardId]/search/_components/noticeboard-search-input";
import { CourseworkSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/coursework/[courseworkId]/search/_components/coursework-search-input";
import { AssignmentSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/[tutorId]/assignments/[assignmentId]/search/_components/assignment-search-input";
import { PayrollSearchInput } from "@/app/(dashboard)/(routes)/payroll/create-payroll/[payrollId]/search/_components/payroll-search-input";
import { CourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/course-course-noticeboard/[course-course-noticeboardId]/search/_components/course-course-noticeboard-search-input";

type SearchInputComponent = FC<object>;

export const NavbarRoutes: FC<object> = (): ReactElement => {
  const pathname: string | null = usePathname();
  const isFacultyPage = pathname?.startsWith("/faculty");
  const isCoursePage = pathname?.includes("/course");
  const isNoticeboardPage = pathname?.includes("/noticeboard");
  const isCourseworkPage = pathname?.includes("/coursework");
  const isTutorPage = pathname?.includes("/tutor");
  const isAssignmentPage = pathname?.includes("/assignment");
  const isCourseNoticeboardPage = pathname?.includes("/courseNoticeboard");
  const isPayrollPage = pathname?.includes("/payroll");

  let isSearchPages: SearchInputComponent | undefined;
  if (isTutorPage) {
    isSearchPages = TutorSearchInput;
  } else if (isCoursePage) {
    isSearchPages = CourseSearchInput;
  } else if (isNoticeboardPage) {
    isSearchPages = NoticeboardSearchInput;
  } else if (isCourseworkPage) {
    isSearchPages = CourseworkSearchInput;
  } else if (isAssignmentPage) {
    isSearchPages = AssignmentSearchInput;
  } else if (isCourseNoticeboardPage) {
    isSearchPages = CourseNoticeboardSearchInput;
  } else if (isPayrollPage) {
    isSearchPages = PayrollSearchInput;
  } else if (isFacultyPage) {
    isSearchPages = FacultyIdSearchInput;
  }
  return (
    <>
      {(isFacultyPage ||
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
        {isFacultyPage ||
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
          <Link href="/faculty/faculties">
            <Button size="sm" variant="ghost">
              Faculty
            </Button>
          </Link>
        )}
        <Link href="/payroll/payrolls">
          <Button size="sm" variant="ghost">
            Payroll
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/course/courses">
          <Button size="sm" variant="ghost">
            Course
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/tutors">
          <Button size="sm" variant="ghost">
            Topic
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/noticeboard/noticeboards">
          <Button size="sm" variant="ghost">
            Faculty Notice
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/coursework/courseworks">
          <Button size="sm" variant="ghost">
            Coursework
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/course/${courseId}/courseNoticeboard/courseNoticeboards">
          <Button size="sm" variant="ghost">
            Course Notice
          </Button>
        </Link>

        <Link href="/faculty/create-faculty/${facultyId}/course/${courseId}/assignment/assignments">
          <Button size="sm" variant="ghost">
            Assignment
          </Button>
        </Link>

        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </>
  );
};
