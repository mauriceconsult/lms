import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentProject } from "@/actions/get-studentProject";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, FileIcon } from "lucide-react";
import { Banner } from "@/components/banner";
import { StudentProjectTitleForm } from "./_components/studentProject-title-form";
import { StudentProjectDescriptionForm } from "./_components/studentProject-description-form";
import { StudentProjectAttachmentForm } from "./_components/studentProject-attachment-form";
import { StudentProjectAbstractForm } from "./_components/studentProject-abstract-form";
// import { Banner } from "@/components/banner";

const StudentProjectIdPage = async ({
  params,
}: {
  params: { courseworkId: string; studentProjectId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { coursework, studentProject } = await getStudentProject({
    userId,
    courseworkId: params.courseworkId,
    studentProjectId: params.studentProjectId,
  }) 

  if (!coursework || !studentProject) {
    return redirect("/");
  }
  const requiredFields = [
    studentProject.title,
    studentProject.courseworkId,
    studentProject.abstract,
    studentProject.description,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  // const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!studentProject.isPublished && (
        <Banner
          variant="warning"
          label="This project is unpublished. It will not be visible to the Faculty."
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Student Faculty Project
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              {/* <CourseworkActions
              disabled={!isComplete}
              studentProjectId={params.studentProjectId}
              courseworkId={params.courseworkId}
              isPublished={studentProject.isPublished}
            /> */}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Coursework details</h2>
              </div>
              <StudentProjectTitleForm
                initialData={studentProject}
                studentProjectId={studentProject.id}
                courseworkId={studentProject.courseworkId || ""}
              />
              <StudentProjectAbstractForm
                initialData={studentProject}
                studentProjectId={studentProject.id}
                courseworkId={studentProject.courseworkId || ""}
              />
              <StudentProjectDescriptionForm
                initialData={studentProject}
                studentProjectId={studentProject.id}
                courseworkId={studentProject.courseworkId || ""}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={FileIcon} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <StudentProjectAttachmentForm
                  initialData={{
                    ...studentProject,
                    attachments: [], // Provide an empty array or fetch attachments separately if needed
                  }}
                  studentProjectId={studentProject.id}
                  courseworkId={studentProject.courseworkId || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProjectIdPage;
