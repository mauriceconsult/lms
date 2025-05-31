import { db } from "@/lib/db";
import { Schools } from "@/app/(dashboard)/(routes)/search/_components/schools";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FacultySearchInput } from "./_components/faculty-search-input";
import { getFaculties } from "@/actions/get-faculties";
import { FacultiesList } from "@/app/(dashboard)/(routes)/search/_components/faculties-list";


interface FacultySearchPageProps {
  facultySearchParams: {
    name: string;
    schoolId: string;
  };
}
const FacultySearchPage = async ({
  facultySearchParams
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
    ...facultySearchParams
  })
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <FacultySearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />  
        <FacultiesList items={faculties}/>
      </div>
    </>
  );
};
export default FacultySearchPage;
