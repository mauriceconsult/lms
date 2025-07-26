import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { FacultyNavbar } from "./_components/faculty-navbar";
import { FacultySidebar } from "./_components/faculty-sidebar";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";

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
      courseworks: true,
      attachments: true,
      noticeboards: true,
      courses: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        include: {
          courseNoticeboards: {
            include: {
              attachments: true, // Include attachments
            },
          },
          tuitions: {
            include: {
              attachments: true,
            },
          },
          tutors: {
            orderBy: {
              position: "asc",
            },
            include: {
              attachments: true, // Include attachments
            },
          },
          attachments: true,
          assignments: {
            where: {
              isPublished: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!faculty) {
    return redirect("/");
  }

  // Calculate progress for each course
  const coursesWithProgress = await Promise.all(
    faculty.courses.map(async (course) => {
      const progressCount = await getProgress(userId, course.id);
      return { ...course, progressCount };
    })
  );

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <FacultyNavbar faculty={{ ...faculty, courses: coursesWithProgress }} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <FacultySidebar
          faculty={{ ...faculty, courses: coursesWithProgress }}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default FacultyLayout;
