"use client";

const CourseNavbar = () => {
  console.log(`[${new Date().toISOString()} CourseNavbar] Rendering`);
  return (
    <div className="h-[80px] bg-gray-800 text-white flex items-center justify-between px-6">
      <h1>Course Navbar</h1>
    </div>
  );
};

export default CourseNavbar;
