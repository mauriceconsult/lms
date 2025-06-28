import { getStudentProject } from "@/actions/get-studentProject";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
// import { Attachment } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseworkRegisterButton } from "./_components/coursework-register-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

const StudentProjectIdPage = async ({
  params,
}: {
  params: { courseworkId: string; studentProjectId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    coursework,
    studentProject,
    attachments,
    // nextStudentProject
  } = await getStudentProject({
    userId,
    courseworkId: params.courseworkId,
    studentProjectId: params.studentProjectId,
  });
  if (
    !coursework
    // ||
    // !studentProject ||
    // !attachments ||
    // !nextStudentProject
  ) {
    return redirect("/");
  }
  const isLocked = !coursework.userId;
  return (
    <div>
      {coursework?.userId && (
        <Banner
          label="You have successfully submitted this Student Project"
          variant="success"
        />
      )}
      {isLocked && (
        <Banner
          label="You need to submit this Student Project to manage this page"
          variant="warning"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
                <div>
                  <h1 className="text-2xl">Student Project Creation</h1>
                  <span>
                    At least one published Coursework is required for a Student
                    Project to be publishable.
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                <h2 className="text-2xl font-semibold mb-2">
                  {coursework.title}
                </h2>
                <CourseworkRegisterButton
                  courseworkId={params.courseworkId}
                  userId={userId}
                />
              </div>
              <Separator />
              <div>
                <Preview value={studentProject.title!} />
              </div>
              {!!attachments.length && (
                <>
                  <Separator />
                  <div className="p-4">
                    {attachments.map((attachment) => (
                      <a
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                      >
                        <File />
                        <p className="line-clamp-1">{attachment.name}</p>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProjectIdPage;
