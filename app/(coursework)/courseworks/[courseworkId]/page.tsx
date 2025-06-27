import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseworkIdPage = async ({ params }: { params: { courseworkId: string } }) => {
  const coursework = await db.coursework.findUnique({
    where: {
      id: params.courseworkId,
    },
    include: {
      studentProjects: true,
    },
  });
  if (!coursework) {
    return redirect("/");
  }
return redirect(`/courseworks/${coursework.id}/studentProjects/${coursework.studentProjects[0].id}`);
};

export default CourseworkIdPage
