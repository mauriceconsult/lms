"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { CourseSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/search/_components/course-search-input";

const NavbarRoutes = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  console.log("[NavbarRoutes] Pathname:", pathname);

  const isCoursePage = pathname?.startsWith("/courses");

  return (
    <div className={`flex items-center gap-x-4 w-full px-4 ${className}`}>
      {isCoursePage && (
        <div className="w-64">
          <CourseSearchInput />
        </div>
      )}
      <Link
        href="/docs"
        className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
      >
        Docs
      </Link>
      <div className="flex gap-x-2 ml-auto">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            console.log("[NavbarRoutes] Exit clicked");
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </div>
    </div>
  );
};

export default NavbarRoutes;
