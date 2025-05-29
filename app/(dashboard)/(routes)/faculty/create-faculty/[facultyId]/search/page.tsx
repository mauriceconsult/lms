import { db } from "@/lib/db";
import { Faculties } from "./_components/faculties";
import { FacultySearchInput } from "./_components/faculty-search-input";
// import { getFacultys } from "@/actions/get-faculties";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { FacultysList } from "@/components/courses-list";

interface FacultySearchPageProps {
  searchParams: {
    title: string;
    facultyId: string;
  };
}
const FacultySearchPage = async ({}: // searchParams
FacultySearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  // const courses = await getFacultys({
  //   userId,
  //   ...searchParams
  // })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <FacultySearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Faculties items={faculties} />
        {/* <FacultysList items={courses} /> */}
      </div>
    </>
  );
};
export default FacultySearchPage;
