"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Use useUser instead of useCurrentUser
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut, Layout, File } from "lucide-react";
import Link from "next/link";
import { FC, ReactElement } from "react";

interface FacultyNavbarRoutesProps {
  facultyId?: string;
}

export const FacultyNavbarRoutes: FC<FacultyNavbarRoutesProps> = ({
  facultyId,
}): ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser(); // Get user from useUser
  const isAdmin = user?.publicMetadata?.role === "admin";

  const isFacultyPage = pathname?.startsWith("/faculties");
  const isCoursePage = pathname?.includes("/courses");
  const isNoticeboardPage = pathname?.includes("/noticeboards");

  const basePath = facultyId ? `/faculties/${facultyId}` : "/faculties";
  const adminBasePath = facultyId
    ? `/faculty/create-faculty/${facultyId}`
    : "/faculty/create-faculty";

  return (
    <div className="h-[80px] flex items-center justify-between px-6 bg-white shadow">
      <div className="flex items-center gap-x-2 ml-auto">
        {/* Show admin routes for admins, view routes for students */}
        {isAdmin ? (
          <>
            <Link href={adminBasePath}>
              <Button size="sm" variant="ghost">
                <Layout className="h-4 w-4 mr-2" />
                Faculties
              </Button>
            </Link>
            {facultyId && (
              <>
                <Link href={`${adminBasePath}/course/courses`}>
                  <Button size="sm" variant="ghost">
                    <Layout className="h-4 w-4 mr-2" />
                    Courses
                  </Button>
                </Link>
                <Link href={`${adminBasePath}/noticeboard/noticeboards`}>
                  <Button size="sm" variant="ghost">
                    <File className="h-4 w-4 mr-2" />
                    Noticeboards
                  </Button>
                </Link>
              </>
            )}
          </>
        ) : (
          <>
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
                <Link href={`${basePath}/noticeboards`}>
                  <Button size="sm" variant="ghost">
                    <File className="h-4 w-4 mr-2" />
                    Noticeboards
                  </Button>
                </Link>
              </>
            )}
          </>
        )}

        {/* Exit button on faculty, course, or noticeboard pages */}
        {(isFacultyPage || isCoursePage || isNoticeboardPage) && (
          <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        )}

        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
};
