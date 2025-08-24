import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tutors } from "../../../search/_components/tutors";
import { getAssignments } from "@/actions/get-assignments";
import { AssignmentSearchInput } from "./_components/assignment-search-input";
import { AssignmentsList } from "./_components/assignments-list";


interface AssignmentSearchPageProps {
  searchParams: Promise<{
    title: string;
    adminId: string;
    courseId: string;
    tutorialId: string;
    assignmentId: string;
  }>;
}
const AssignmentSearchPage = async ({
  searchParams
}: AssignmentSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const tutorials = await db.tutor.findMany({
    orderBy: {
      title: "asc"
    }
  })
  const assignments = await getAssignments({
    userId,
    ...await searchParams,
  });
  
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <AssignmentSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Tutors items={tutorials} />
        <AssignmentsList item={assignments} 
        />
      </div>
    </>
  );
};
export default AssignmentSearchPage;
