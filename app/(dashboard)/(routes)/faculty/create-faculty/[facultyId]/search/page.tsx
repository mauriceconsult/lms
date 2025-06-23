import { db } from "@/lib/db";
import { Schools } from "@/app/(dashboard)/(routes)/search/_components/schools";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFaculties } from "@/actions/get-faculties";
import { FacultiesList } from "@/app/(dashboard)/(routes)/search/_components/faculties-list";
import { FacultyIdSearchInput } from "./_components/facultyId-search-input";



interface FacultySearchPageProps {
  searchParams: {
    title: string;
    schoolId: string;
  };
}
const FacultySearchPage = async ({
  searchParams
}: FacultySearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const schools = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const faculties = await getFaculties({
    userId,
    ...searchParams
  })
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <FacultyIdSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />  
        <FacultiesList items={faculties}/>
      </div>
    </>
  );
};
export default FacultySearchPage;
