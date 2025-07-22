import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Faculties } from "../../../search/_components/faculties";
import { CourseworksList } from "./_components/courseworks-list";
import { CourseworkSearchInput } from "./_components/coursework-search-input";
import { getCourseworks } from "@/actions/get-courseworks";

interface CourseworkIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    facultyId: string;
  }>;
}
const CourseworkSearchPage = async ({
  searchParams,
}: CourseworkIdSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courseworks = await getCourseworks({
    userId,
    ...await searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseworkSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Faculties items={faculties} />
        <CourseworksList items={courseworks} />
      </div>
    </>
  );
};
export default CourseworkSearchPage;
