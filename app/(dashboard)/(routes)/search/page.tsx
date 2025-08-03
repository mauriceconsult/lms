import { db } from "@/lib/db";
import { Schools } from "./_components/schools";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFaculties } from "@/actions/get-faculties";
import { FacultiesList } from "./_components/faculties-list";

interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    schoolId: string;
    view?: string; // Add view parameter
  }>;
}

export default async function RouteSearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { title, schoolId, view } = await searchParams;
  const schools = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const faculties = await getFaculties({
    userId,
    title,
    schoolId,
  });

  return (
    <div className="p-6 space-y-4">
      <Schools items={schools} />
      <FacultiesList items={faculties} viewMode={view as "admin" | "student" | undefined} />
    </div>
  );
}
