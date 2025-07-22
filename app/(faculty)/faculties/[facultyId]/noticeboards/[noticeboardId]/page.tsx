import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNoticeboard } from "@/actions/get-noticeboard";
import { Banner } from "@/components/banner";


const NoticeboardIdPage = async ({
  params,
}: {
  params: Promise<{ facultyId: string; noticeboardId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    noticeboard,    
    // faculty,
    // attachments,
    // nextNoticeboard,
    
  } = await getNoticeboard({
    userId,
    facultyId: (await params).facultyId,
    noticeboardId: (await params).noticeboardId,
  });
  if (!noticeboard) {
    return redirect("/");
  }
  const isLocked = !noticeboard.userId && !noticeboard;
  // const completeOnEnd = !userProgress?.isCompleted;

  // TODO: Replace this mock with actual user progress fetching logic
  const userProgress = { isCompleted: false };

  return (
    <>
      <div>
        {userProgress?.isCompleted && (
          <Banner label="You have published this Noticeboard" variant="success" />
        )}
        {isLocked && (
          <Banner
            label="You need to publish this Course to manage this Noticeboard"
            variant="warning"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Noticeboards</h1>
                  <div className="text-sm text-slate-700">
                    {/* <div>Completed fields {completionText}</div> */}
                  </div>
                </div>
                {/* <NoticeboardActions
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
  
export default NoticeboardIdPage;
