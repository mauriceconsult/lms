// import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Course, Faculty } from "@prisma/client";
import { redirect } from "next/navigation";
import { FacultySidebarItem } from "./faculty-sidebar-item";

interface FacultySidebarProps {
    faculty: Faculty & {
        courses: (Course)[]
    };
}

export const FacultySidebar = async ({
    faculty
}: FacultySidebarProps) => {
     const { userId } = await auth();
        if (!userId) {
            return redirect("/")
    }
   
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{faculty.title}</h1>
        </div>
        <div className="flex flex-col w-full">
          {faculty.courses.map((course) => (
            <FacultySidebarItem
              key={course.id}
              id={course.id}
              label={course.title}
              facultyId={faculty.id}
            />
          ))}
        </div>
      </div>
    );
};
