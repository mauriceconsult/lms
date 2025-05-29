"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { FacultySearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/search/_components/faculty-search-input";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/search/_components/course-search-input";
import { TutorSearchInput } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/[tutorId]/search/_components/tutor-search-input";
import React, { FC, ReactElement } from "react";

type SearchInputComponent = FC<object>;

export const NavbarRoutes: FC<object> = (): ReactElement => {
  const pathname: string | null = usePathname();
  const isFacultyPage: boolean = pathname?.startsWith("/faculty") ?? false;
  const isTutorPage: boolean = pathname?.includes("/tutor") ?? false;
  const isCoursePage: boolean = pathname?.includes("/course") ?? false;
  
  let isSearchPages: SearchInputComponent | undefined;
  if (isTutorPage) {
    isSearchPages = TutorSearchInput;
  } else if (isCoursePage) {
    isSearchPages = CourseSearchInput;
  } else if (isFacultyPage) {
    isSearchPages = FacultySearchInput;
  }
  return (
    <>
      {(isFacultyPage || isCoursePage || isTutorPage) && (
        <div className="mt-16 hidden md:block">
          {isSearchPages && React.createElement(isSearchPages)}
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isFacultyPage || isTutorPage || isCoursePage ? (
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

        <Link href="/doc/create-doc">
          <Button size="sm" variant="ghost">
            Docs
          </Button>
        </Link>

        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </>
  );
};
