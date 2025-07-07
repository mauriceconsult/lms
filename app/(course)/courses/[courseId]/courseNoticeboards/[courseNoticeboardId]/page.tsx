import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseNoticeboard } from "@/actions/get-courseNoticeboard";
import { Banner } from "@/components/banner";


const CourseNoticeboardIdPage = async ({
  params,
}: {
  params: { courseId: string; courseNoticeboardId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    courseNoticeboard,
    course,
    // attachments,
    // nextCourseNoticeboard,
    
  } = await getCourseNoticeboard({
    userId,
    courseId: params.courseId,
    courseNoticeboardId: params.courseNoticeboardId,
  });
  if (!courseNoticeboard || !course) {
    return redirect("/");
  }
  const isLocked = !courseNoticeboard.userId && !courseNoticeboard;
  // const completeOnEnd = !userProgress?.isCompleted;

  // TODO: Replace this mock with actual user progress fetching logic
  const userProgress = { isCompleted: false };

  return (
    <>
      <div>
        {userProgress?.isCompleted && (
          <Banner label="You have published this CourseNoticeboard" variant="success" />
        )}
        {isLocked && (
          <Banner
            label="You need to publish this Course to manage this CourseNoticeboard"
            variant="warning"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">CourseNoticeboards</h1>
                  <div className="text-sm text-slate-700">
                    {/* <div>Completed fields {completionText}</div> */}
                  </div>
                </div>
                {/* <CourseNoticeboardActions
                  disabled={!isComplete}
                  courseId={params.courseId}
                  isPublished={course.isPublished}
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
  
export default CourseNoticeboardIdPage;
