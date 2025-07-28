"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut, Layout, ListChecks, File } from "lucide-react";
import Link from "next/link";
import { FC, ReactElement } from "react";

interface FacultyNavbarRoutesProps {
  facultyId?: string; // Optional, as some routes (e.g., /faculties) don't have facultyId
}

export const FacultyNavbarRoutes: FC<FacultyNavbarRoutesProps> = ({
  facultyId,
}): ReactElement => {

  const basePath =
    facultyId && facultyId !== "" ? `/faculties/${facultyId}` : "/faculties";

  return (
    <div className="h-[80px] flex items-center justify-between px-6 bg-white shadow">
      {/* Navigation */}
      <div className="flex items-center gap-x-2 ml-auto">
        <Link href={basePath}>
          <Button size="sm" variant="ghost">
            <Layout className="h-4 w-4 mr-2" />
            Faculties
          </Button>
        </Link>
        {facultyId && (
          <>
            <Link href={`${basePath}/courses`}>
              <Button size="sm" variant="ghost">
                <Layout className="h-4 w-4 mr-2" />
                Courses
              </Button>
            </Link>
            <Link href={`${basePath}/courseworks`}>
              <Button size="sm" variant="ghost">
                <ListChecks className="h-4 w-4 mr-2" />
                Courseworks
              </Button>
            </Link>
            <Link href={`${basePath}/noticeboards`}>
              <Button size="sm" variant="ghost">
                <File className="h-4 w-4 mr-2" />
                Noticeboards
              </Button>
            </Link>
            <Link href={`${basePath}/assignments`}>
              <Button size="sm" variant="ghost">
                <ListChecks className="h-4 w-4 mr-2" />
                Assignments
              </Button>
            </Link>
            <Link href={`${basePath}/course-noticeboards`}>
              <Button size="sm" variant="ghost">
                <File className="h-4 w-4 mr-2" />
                Course Notices
              </Button>
            </Link>
          </>
        )}
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
};
