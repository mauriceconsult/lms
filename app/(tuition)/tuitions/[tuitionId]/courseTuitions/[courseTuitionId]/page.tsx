import { getCourseTuition } from "@/actions/get-courseTuition";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
// import { Attachment } from "@prisma/client";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

const CourseTuitionIdPage = async ({
  params,
}: {
  params: { tuitionId: string; courseTuitionId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { tuition, courseTuition, attachments, nextCourseTuition } =
    await getCourseTuition({
      userId,
      tuitionId: params.tuitionId,
      courseTuitionId: params.courseTuitionId,
    });
  if (!tuition || !courseTuition || !attachments || !nextCourseTuition) {
    return redirect("/");
  }
  const isLocked = !tuition.userId;
  return (
    <div>
      {tuition?.userId && (
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
                <h2 className="text-2xl font-semibold mb-2">{tuition.title}</h2>
                {/* <CourseworkRegisterButton
                  tuitionId={params.tuitionId}
                  userId={userId}
                /> */}
              </div>
              <Separator />
              <div>
                <Preview value={courseTuition.title!} />
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

export default CourseTuitionIdPage;
