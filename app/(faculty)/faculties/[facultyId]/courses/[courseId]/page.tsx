import { getCourse } from "@/actions/get-course";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {   
    course,   
    attachments,
  } = await getCourse({
    userId,
    facultyId: (await params).facultyId,
    courseId: (await params).courseId,
  });
  if (!course) {
    return redirect("/");
  }
  const isLocked = !course.userId;
  return (
    <div>
      {course?.userId && (
        <Banner
          label="You have successfully published this Course"
          variant="success"
        />
      )}
      {isLocked && (
        <Banner
          label="You need to publish this Course to manage it"
          variant="warning"
        />
      )}
      <div className="space-y-4">
        <div>
          <h1 className="font-bold mb-4">Faculty Name: {course.title}</h1>
          <p className="text-base text-slate-600 mb-6">
            Faculty description: {}
            {course.description || "No description available."}
          </p>
          {attachments.map((attachment) => (
            <div key={attachment.id} className="p-4 border rounded-md">
              <h2 className="text-sm text-slate-500">
                Attachment(s) Id: {attachment.courseId}
              </h2>
            </div>
          ))}
        </div>
      </div>
      {/* Add more components or functionality as needed */}
    </div>
  );
};

export default CourseIdPage;
