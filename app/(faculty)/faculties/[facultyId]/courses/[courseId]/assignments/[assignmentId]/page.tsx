import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAssignment } from "@/actions/get-assignment";
import { Banner } from "@/components/banner";


const AssignmentIdPage = async ({
  params,
}: {
  params: { courseId: string; assignmentId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    assignment,
    course,
    // attachments,
    // nextAssignment,
    userProgress,    
  } = await getAssignment({
    userId,
    courseId: params.courseId,
    assignmentId: params.assignmentId,
  });
  if (!assignment || !course) {
    return redirect("/");
  }
  const isLocked = !assignment.userId && !assignment;
  // const completeOnEnd = !userProgress?.isCompleted;
  return (
    <>
      <div>
        {userProgress?.isCompleted && (
          <Banner label="You have completed this Assignment" variant="success" />
        )}
        {isLocked && (
          <Banner
            label="You need to purchase this Course to manage this Assignment"
            variant="warning"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Assignments</h1>
                  <div className="text-sm text-slate-700">
                    {/* <div>Completed fields {completionText}</div> */}
                  </div>
                </div>
                {/* <AssignmentActions
                  disabled={!isComplete}
                  facultyId={params.facultyId}
                  isPublished={faculty.isPublished}
                /> */}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">                 
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
  
export default AssignmentIdPage;
