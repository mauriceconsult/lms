import { getCourse } from "@/actions/get-course";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const CourseIdPage = async ({
  params,
}: {
  params: { facultyId: string; courseId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    faculty,
    course,   
    attachments,
  } = await getCourse({
    userId,
    facultyId: params.facultyId,
    courseId: params.courseId,
  });
  if (!faculty || !course) {
    return redirect("/");
  }
  const isLocked = !faculty.userId;
  return (
    <div>
      {faculty?.userId && (
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
          <h1 className="font-bold mb-4">Faculty Name: {faculty.title}</h1>
          <p className="text-base text-slate-600 mb-6">
            Faculty description: {}
            {faculty.description || "No description available."}
          </p>
          {attachments.map((attachment) => (
            <div key={attachment.id} className="p-4 border rounded-md">
              <h2 className="text-sm text-slate-500">
                Attachment(s) Id: {attachment.facultyId}
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
