import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentProject } from "@/actions/get-studentProject";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
// import { Banner } from "@/components/banner";


const StudentProjectIdPage = async ({
  params,
}: {
    params: { facultyId: string; courseworkId: string; studentProjectId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    coursework,
    studentProject,  
  } = await getStudentProject({
    userId,
    facultyId: params.facultyId,
    courseworkId: params.courseworkId,
    studentProjectId: params.studentProjectId,
  });
  if ( !coursework || !studentProject ) {
    return redirect("/");
  }
  // const isLocked = !studentProject.userId;
  
  return (
    // <div>
    //   {userProgress?.isCompleted && (
    //     <Banner label="You have completed this topic" variant="success" />
    //   )}
    //   {isLocked && (
    //     <Banner
    //       label="You need to purchase this Course to watch this Topic"
    //       variant="warning"
    //     />
    //   )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Student Faculty Project</h1>
             
              </div>
       
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
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentProjectIdPage;
