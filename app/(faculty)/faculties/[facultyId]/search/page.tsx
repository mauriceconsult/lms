import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFaculties } from "@/actions/get-faculties";
import { Faculties } from "./_components/faculties";
import { CoursesList } from "./_components/courses-list";
import { db } from "@/lib/db";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    facultyId?: string;
  }>;
}

const FacultySearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { title, facultyId } = await searchParams;

  const courses = await db.course.findMany({
    where: {
      ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
      ...(facultyId ? { facultyId } : {}),
      isPublished: true,
    },
    include: {
      faculty: true, // Include faculty relation
    },
    orderBy: {
      title: "asc",
    },
  });

  const faculties = await getFaculties({
    userId,
    title,
    facultyId,
  });

  return (
    <div className="p-6 space-y-4">
      <Faculties items={faculties} />
      <CoursesList items={courses} />
    </div>
  );
};

export default FacultySearchPage;
