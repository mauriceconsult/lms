import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseworkIdPage = async ({ params }: { params: { courseworkId: string } }) => {
  const coursework = await db.coursework.findUnique({
    where: {
      id: params.courseworkId,
    },
  });
  if (!coursework) {
    return redirect("/");
  }
return redirect(`/faculties/${coursework.id}`);
};

export default CourseworkIdPage;
