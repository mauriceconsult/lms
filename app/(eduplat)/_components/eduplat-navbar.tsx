import { CourseCourseNoticeboardSearchInput } from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/course-coursenoticeboard/[course-coursenoticeboardId]/search/_components/course-coursenoticeboard-search-input";
import Link from "next/link";


export const EduplatNavbar = () => {
  return (
    <nav className="h-[80px] flex items-center justify-between px-6 bg-white shadow">
      <div className="flex items-center space-x-4">
        <Link href="/admins">Admins</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/tutors">Tutors</Link>
        <Link href="/about">About</Link>
      </div>
      <CourseCourseNoticeboardSearchInput />
    </nav>
  );
};
