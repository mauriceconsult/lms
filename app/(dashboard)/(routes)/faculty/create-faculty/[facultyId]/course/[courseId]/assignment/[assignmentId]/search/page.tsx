import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { Courses } from "../../../search/_components/assignments";
import { AssignmentSearchInput } from "./_components/assignment-search-input";
import { AssignmentsList } from "./_components/assignments-list";
import { Courses } from "./_components/courses";
import { getAssignments } from "@/actions/get-assignments";


interface AssignmentSearchPageProps {
  searchParams: {
    title: string;
    courseId: string;
  };
}
const AssignmentSearchPage = async ({
  searchParams,
}: AssignmentSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const assignments = await getAssignments({
    userId,
    ...searchParams
  })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <AssignmentSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <AssignmentsList items={assignments} />
      </div>
    </>
  );
};
export default AssignmentSearchPage;
