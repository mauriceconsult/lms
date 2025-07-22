import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import FacultySidebar from "./_components/faculty-sidebar";
import { FacultyNavbar } from "./_components/faculty-navbar";
import { redirect } from "next/navigation";

const FacultyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ facultyId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const faculty = await db.faculty.findUnique({
    where: {
      id: (await params).facultyId,
    },
    include: {
      courses: {
        where: {
          isPublished: true,
        },
        include: {
          attachments: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!faculty) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <FacultyNavbar faculty={faculty} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <FacultySidebar faculty={faculty} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default FacultyLayout;
