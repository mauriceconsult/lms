import { db } from "@/lib/db";
import { Schools } from "./_components/schools";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RouteSearchInput } from "./_components/route-search-input";
import { getFaculties } from "@/actions/get-faculties";
import { FacultiesList } from "./_components/faculties-list";


interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    schoolId: string;
  }>;
}
const RouteSearchPage = async ({
  searchParams
}: SearchPageProps) => {
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
    ... await searchParams
  })
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <RouteSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />  
        <FacultiesList items={faculties}/>
      </div>
    </>
  );
};
export default RouteSearchPage;
