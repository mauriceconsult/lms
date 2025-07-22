import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCoursework } from "@/actions/get-coursework";
import { Banner } from "@/components/banner";


const CourseworkIdPage = async ({
  params,
}: {
  params: Promise<{ facultyId: string; courseworkId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    coursework,
    faculty,
    // attachments,
    // nextCoursework,
    // userProgress,    
  } = await getCoursework({
    userId,
    facultyId: (await params).facultyId,
    courseworkId: (await params).courseworkId,
  });
  if (!coursework || !faculty) {
    return redirect("/");
  }
  const isLocked = !coursework && !faculty;
  // const completeOnEnd = !userProgress?.isCompleted;
  return (
    <>
      <div>
        {userId && (
          <Banner label="Coursework successfully published." variant="success" />
        )}
        {isLocked && (
          <Banner
            label="You need to publish this Coursework to manage the page."
            variant="warning"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Courseworks</h1>
                  <div className="text-sm text-slate-700">
                    {/* <div>Completed fields {completionText}</div> */}
                  </div>
                </div>
                {/* <CourseworkActions
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
  
export default CourseworkIdPage;
