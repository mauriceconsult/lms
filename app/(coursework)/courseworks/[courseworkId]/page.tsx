import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseworkIdPage = async ({ params }: { params: { courseworkId: string } }) => {
  const coursework = await db.coursework.findUnique({
    where: {
      id: params.courseworkId,
    },
    include: {
      studentProjects: {
        where: {
          isSubmitted: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!coursework) {
    return redirect("/");
  }  
  return redirect(   
      `/courseworks/${coursework.id}/studentProjects/${coursework.studentProjects}`
  );
};

export default CourseworkIdPage
