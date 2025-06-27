import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
// import { StudentProjectActions } from "./_components/coursework-actions";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  // Eye,
  LayoutDashboard,
//   Video,
  //   ListChecks
} from "lucide-react";
import { StudentProjectTitleForm } from "./_components/studentProject-title-form";
import { StudentProjectDescriptionForm } from "./_components/studentProject-description-form";
import { StudentProjectCourseworkForm } from "./_components/studentProject-coursework-form";
import { StudentProjectAbstractForm } from "./_components/studentProject-abstract-form";
import Link from "next/link";
import { StudentProjectActions } from "./_components/studentProject-actions";

const StudentProjectIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseworkId: string;
    studentProjectId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const studentProject = await db.studentProject.findUnique({
    where: {
      id: params.studentProjectId,
      courseworkId: params.courseworkId,
      userId,
    },
  });
  const coursework = await db.coursework.findMany({
    orderBy: {
      title: "asc",
    },
  });
  console.log(coursework);
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
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!studentProject.isSubmitted && (
        <Banner
          variant="warning"
          label="This project is unsubmitted. It will not be visible to the Faculty."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${params.facultyId}/coursework/${params.courseworkId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Coursework creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Student Project creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <StudentProjectActions
                disabled={!isComplete}
                facultyId={params.facultyId}
                courseworkId={params.courseworkId}
                studentProjectId={params.studentProjectId}
                isSubmitted={studentProject.isSubmitted}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your project</h2>
              </div>
            </div>
            <StudentProjectTitleForm
              initialData={studentProject}
              facultyId={params.facultyId}
              courseworkId={studentProject.courseworkId || ""}
              studentProjectId={studentProject.id}
            />
            <StudentProjectCourseworkForm
              initialData={studentProject}
              facultyId={params.facultyId}
              studentProjectId={studentProject.id}
              courseworkId={studentProject.courseworkId || ""}
              options={coursework.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <StudentProjectAbstractForm
              initialData={studentProject}
              facultyId={params.facultyId}
              studentProjectId={studentProject.id}
              courseworkId={studentProject.courseworkId || ""}
            />
            <StudentProjectDescriptionForm
              initialData={studentProject}
              facultyId={params.facultyId}
              studentProjectId={studentProject.id}
              courseworkId={studentProject.courseworkId || ""}
            />
          </div>
          <div>
            {/* <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div> */}
            {/* <StudentProjectAccessForm
              initialData={studentProject}
              facultyId={params.facultyId}
              studentProjectId={studentProject.id}
              courseworkId={studentProject.courseworkId || ""}
            /> */}
          </div>
        </div>
        {/* <div className="flex items-center gap-x-2">
          <IconBadge icon={Video} />
          <h2 className="text-xl">Add a video</h2>
        </div>
        <StudentProjectVideoForm
          initialData={studentProject}
          facultyId={params.facultyId}
          studentProjectId={studentProject.id}
          courseworkId={studentProject.courseworkId || ""}
        /> */}
      </div>
    </>
  );
};
export default StudentProjectIdPage;
