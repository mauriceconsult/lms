import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FacultySidebar } from "./_components/faculty-sidebar";

const FacultyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { facultyId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
    },
    include: {
      courses: {
        where: {
          isPublished: true,
        },
      },
    },
  });
  if (!faculty) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <FacultySidebar faculty={faculty} />
      </div>
      <main className="md:pl-80 h-full">{children}</main>
    </div>
  );
};

export default FacultyLayout;
