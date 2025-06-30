import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TuitionSearchInput } from "./_components/tuition-search-input";
import { TuitionsList } from "./_components/tuitions-list";
import { Courses } from "./_components/courses";
import { getTuitions } from "@/actions/get-tuitions";


interface TuitionSearchPageProps {
  searchParams: {
    title: string;
    courseId: string;
  };
}
const TuitionSearchPage = async ({
  searchParams,
}: TuitionSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const tuitions = await getTuitions({
    userId,
    ...searchParams
  })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TuitionSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <TuitionsList items={tuitions} />
      </div>
    </>
  );
};
export default TuitionSearchPage;
