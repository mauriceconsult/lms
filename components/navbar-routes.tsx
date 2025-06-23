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

type SearchInputComponent = FC<object>;

export const NavbarRoutes: FC<object> = (): ReactElement => {
  const pathname: string | null = usePathname();
  const isFacultyPage = pathname?.startsWith("/faculty");
  const isTutorPage = pathname?.includes("/tutor");
  const isCoursePage = pathname?.includes("/course");
  const isNoticePage = pathname?.includes("/notice");

  let isSearchPages: SearchInputComponent | undefined;
  if (isTutorPage) {
    isSearchPages = TutorSearchInput;
  } else if (isCoursePage) {
    isSearchPages = CourseSearchInput;
  } else if (isNoticePage) {
    isSearchPages = NoticeboardSearchInput;
  } else if (isFacultyPage) {
    isSearchPages = FacultyIdSearchInput;
  }
  return (
    <>
      {(isFacultyPage || isCoursePage || isTutorPage || isNoticePage) && (
        <div className="mt-16 hidden md:block">
          {isSearchPages && React.createElement(isSearchPages)}
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isFacultyPage || isTutorPage || isCoursePage || isNoticePage ? (
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

        {/* <Link href="/doc/create-doc">
          <Button size="sm" variant="ghost">
            Docs
          </Button>
        </Link> */}

        <Link href="/faculty/create-faculty/${facultyId}/notice/notices">
          <Button size="sm" variant="ghost">
            Notice
          </Button>
        </Link>

        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </>
  );
};
