import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const FacultyIdPage = async ({ params }: { params: { facultyId: string } }) => {
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
    },
    include: {
      courses: {
        where: {
          isPublished: true,
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
return redirect(`/faculties/${faculty.id}/courses/${faculty.courses[0].id}`);
};

export default FacultyIdPage;
