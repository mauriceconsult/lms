import {
    LayoutDashboard,
    // File
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
// import { Banner } from "@/components/banner";

interface StudentProjectIdPageProps {
  params: {
    courseworkId: string;
    studentProjectId: string;
  };
}

const StudentProjectIdPage: React.FC<StudentProjectIdPageProps> = () => {
  return (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Coursework creation</h1>
             
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
