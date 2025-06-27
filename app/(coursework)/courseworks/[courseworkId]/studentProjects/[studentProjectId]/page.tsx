import { getStudentProject } from "@/actions/get-studentProject";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { redirect } from "next/navigation";
const StudentProjectIdPage = async ({
  params,
}: {
  params: { courseworkId: string; studentProjectId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { coursework, attachments } = await getStudentProject({
    userId,
    courseworkId: params.courseworkId,
    studentProjectId: params.studentProjectId,
  });
  if (!coursework) {
    return redirect("/");
  }
  const isLocked = !coursework.userId;
  return (
    <div>
      {coursework?.userId && (
        <Banner
          label="You have successfully published this Student Project"
          variant="success"
        />
      )}
      {isLocked && (
        <Banner
          label="You need to publish this StudentProject to manage it"
          variant="warning"
        />
      )}
      <div className="space-y-4">
        <div>
          <h1 className="font-bold mb-4">Coursework Name: {coursework.title}</h1>
          <p className="text-base text-slate-600 mb-6">
            Coursework description: {}
            {coursework.description || "No description available."}
          </p>
            {attachments.map((attachment: Attachment) => (
            <div key={attachment.id} className="p-4 border rounded-md">
              <h2 className="text-sm text-slate-500">
              Attachment(s) Id: {attachment.courseworkId}
              </h2>
            </div>
            ))}
        </div>
      </div>
      {/* Add more components or functionality as needed */}
    </div>
  );
};

export default StudentProjectIdPage;
