import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const FacultyIdPage = async ({ params }: { params: { facultyId: string } }) => {
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
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
          position: "desc",
        },
        include: {
          courseNoticeboards: true,
          tuitions: true,
          tutors: true,
          attachments: true,
          assignments: {
            where: {
              isPublished: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });
  if (!faculty) {
    return redirect("/");
  }
  return redirect(`/faculties/${faculty.id}/courses/${faculty.courses[0].id}`);
};

export default FacultyIdPage;
