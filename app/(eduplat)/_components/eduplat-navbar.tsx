"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const EduplatNavbar = () => {
  const pathname = usePathname();

  if (!pathname) {
    console.log(`[${new Date().toISOString()} EduplatNavbar] Loading pathname...`);
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex h-full items-center bg-blue-600 text-white px-6">
      <Link href="/eduplat" className="text-lg font-bold">
        EduPlat
      </Link>
      <div className="ml-auto flex gap-2">
        <Link href="/eduplat/admins">
          <Button variant="ghost" className={pathname === "/eduplat/admins" ? "bg-blue-700" : ""}>
            Admins
          </Button>
        </Link>
        <Link href="/eduplat/courses">
          <Button variant="ghost" className={pathname === "/eduplat/courses" ? "bg-blue-700" : ""}>
            Courses
          </Button>
        </Link>
        <Link href="/eduplat/tutorials">
          <Button variant="ghost" className={pathname === "/eduplat/tutorials" ? "bg-blue-700" : ""}>
            Tutorials
          </Button>
        </Link>
      </div>
    </div>
  );
};
