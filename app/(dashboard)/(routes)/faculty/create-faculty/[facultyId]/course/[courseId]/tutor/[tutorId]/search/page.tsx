import { db } from "@/lib/db";
import { Tutors } from "./_components/tutors";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TutorSearchInput } from "./_components/tutor-search-input";


interface TutorSearchPageProps {
  searchParams: {
    title: string;
    tutorId: string;
  };
}
const TutorSearchPage = async ({}: // searchParams
TutorSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tutors = await db.tutor.findMany({
    orderBy: {
      title: "asc",
    },
  });
  // const tutors = await getTutors({
  //   userId,
  //   ...searchParams
  // })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TutorSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Tutors items={tutors} />
        {/* <TutorsList items={tutors} /> */}
      </div>
    </>
  );
};
export default TutorSearchPage;
