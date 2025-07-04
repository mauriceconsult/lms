import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TutorAssignmentSearchInput } from "./_components/tutorAssignment-search-input";
import { Assignments } from "./_components/assignments";
import { TutorAssignmentsList } from "./_components/tutorAssignments-list";
import { getTutorAssignments } from "@/actions/get-tutorAssignments";


interface TutorAssignmentSearchPageProps {
  searchParams: {
    title: string;
    assignmentId: string;
    tutorAssignmentId: string;
  };
}
const TutorAssignmentSearchPage = async ({
  searchParams,
}: TutorAssignmentSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const assignments = await db.assignment.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const tutorAssignments = await getTutorAssignments({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TutorAssignmentSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Assignments items={assignments} />
        <TutorAssignmentsList items={tutorAssignments} />      
      </div>
    </>
  );
};
export default TutorAssignmentSearchPage;
