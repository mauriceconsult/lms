import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Faculty, Course, Attachment } from "@prisma/client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define normalized course type
type NormalizedCourse = Omit<Course, "amount"> & {
  amount: number | null;
  attachments: Attachment[];
};

interface FacultyMobileSidebarProps {
  faculty: Faculty & {
    courses: (Course & { attachments: Attachment[] })[];
  };
}

export const FacultyMobileSidebar = ({
  faculty,
}: FacultyMobileSidebarProps) => {
  // Normalize amount (optional, since FacultyNavbar already normalizes)
  const normalizedFaculty: Faculty & { courses: NormalizedCourse[] } = {
    ...faculty,
    courses: faculty.courses.map((course) => ({
      ...course,
      amount:
        course.amount && !isNaN(parseFloat(course.amount))
          ? parseFloat(course.amount)
          : null,
    })),
  };

  return (
    <Sheet>
      <SheetTrigger
        className="md:hidden pr-4 hover:opacity-75 transition"
        aria-label="Open faculty menu"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <div className="h-full flex flex-col overflow-y-auto shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {normalizedFaculty.imageUrl ? (
                <Image
                  src={normalizedFaculty.imageUrl}
                  alt={`${normalizedFaculty.title} logo`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    {normalizedFaculty.title.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {normalizedFaculty.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {normalizedFaculty.courses.length} course
                  {normalizedFaculty.courses.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <SheetTrigger asChild>
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close faculty menu"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetTrigger>
          </div>
          <div className="flex flex-col w-full">
            <h3 className="px-6 py-2 text-sm font-medium text-gray-500">
              Courses
            </h3>
            {normalizedFaculty.courses.length ? (
              normalizedFaculty.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/faculties/${normalizedFaculty.id}/courses/${course.id}`}
                  className="px-6 py-2 text-sm hover:bg-gray-100"
                >
                  {course.title}
                </Link>
              ))
            ) : (
              <p className="px-6 py-2 text-sm text-gray-500">
                No published courses
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
