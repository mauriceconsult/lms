// app/(eduplat)/_components/eduplat-navbar.tsx
import Link from "next/link";
// import { CourseNoticeboardSearchInput } from "@/app/(eduplat)/_components/course-noticeboard-search-input";

export const EduplatNavbar = () => {
  return (
    <nav className="h-[80px] flex items-center justify-between px-6 bg-white shadow">
      <div className="flex items-center space-x-4">
        <Link href="/admins">Admins</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/tutors">Tutors</Link>
        <Link href="/about">About</Link>
      </div>
      <CourseNoticeboardSearchInput />
    </nav>
  );
};
