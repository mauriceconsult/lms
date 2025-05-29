import { db } from "@/lib/db";
import { Schools } from "./_components/schools";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SearchInput } from "./_components/search-input";


interface SearchPageProps {
  searchParams: {
    title: string;
    schoolId: string;
  };
}
const SearchPage = async ({}: // searchParams
SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const schools = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />
        {/* <CoursesList items={courses} /> */}
      </div>
    </>
  );
};
export default SearchPage;
