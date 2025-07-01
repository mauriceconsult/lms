import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const TuitionIdpage = async ({ params }: { params: { tuitionId: string } }) => {
  const tuition = await db.tuition.findUnique({
    where: {
      id: params.tuitionId,
    },
    include: {
      courseTuitions: {
        where: {
          isSubmitted: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!tuition) {
    return redirect("/")
  }
 return redirect(`/tuitions/${tuition.id}/courseTuitions/${tuition.courseTuitions[0].id}`);
};

export default TuitionIdpage;
