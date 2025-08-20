"use client";

import Link from "next/link";

const CourseNavbar = () => {
  console.log(`[${new Date().toISOString()} CourseNavbar] Rendering`);
  return (
    <div className="h-[80px] bg-gray-800 text-white flex items-center justify-between px-6">
      <Link href="/about" className="text-gray-600 hover:text-blue-600">
        About
      </Link>
    </div>
  );
};

export default CourseNavbar;
