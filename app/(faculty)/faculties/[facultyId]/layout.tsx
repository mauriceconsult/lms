import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import FacultySidebar from "./_components/faculty-sidebar";
import { FacultyNavbar } from "./_components/faculty-navbar";

const FacultyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { facultyId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please log in to view this page.</div>;
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
    return <div>Faculty not found.</div>;
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
