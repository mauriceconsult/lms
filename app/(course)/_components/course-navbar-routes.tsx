import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CourseNavbarRoutesProps {
  courseId: string;
}

export function CourseNavbarRoutes({
  courseId,
}: CourseNavbarRoutesProps) {
  return (
    <div className="flex items-center justify-between h-full px-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/faculties/courses/list`}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Courses</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={`/faculties/courses/${courseId}/edit?role=admin`}
        >
          <Button variant="outline">Edit Course</Button>
        </Link>
      </div>
    </div>
  );
}
