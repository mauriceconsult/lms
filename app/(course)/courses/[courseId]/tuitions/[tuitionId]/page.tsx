import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTuition } from "@/actions/get-tuition";
import { Banner } from "@/components/banner";


const TuitionIdPage = async ({
  params,
}: {
  params: { courseId: string; tuitionId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    tuition,
    course,
    // attachments,
    // nextTuition,
    
  } = await getTuition({
    userId,
    courseId: params.courseId,
    tuitionId: params.tuitionId,
  });
  if (!tuition || !course) {
    return redirect("/");
  }
  const isLocked = !tuition.userId && !tuition;
  // const completeOnEnd = !userProgress?.isCompleted;
  return (
    <>
      <div>
        {tuition?.isPaid && (
          <Banner label="You have paid this Tuition" variant="success" />
        )}
        {isLocked && (
          <Banner
            label="This Tuition is locked. Please pay to unlock."
            variant="warning"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Tuitions</h1>
                  <div className="text-sm text-slate-700">
                    {/* <div>Completed fields {completionText}</div> */}
                  </div>
                </div>
                {/* <TuitionActions
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
  
export default TuitionIdPage;
