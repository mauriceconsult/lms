"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CourseNavbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          InstaSkul
        </Link>
        <div className="space-x-4">
          <Link href="/courses" className="text-blue-600 hover:underline">
            Courses
          </Link>
          <Link href="/about" className="text-blue-600 hover:underline">
            About
          </Link>
          <Link href="/docs" className="text-blue-600 hover:underline">
            Docs
          </Link>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
