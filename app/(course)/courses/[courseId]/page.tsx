import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdpage = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      tutors: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/")
  }
 return redirect(`/courses/${course.id}/tutors/${course.tutors[0].id}`);
};

export default CourseIdpage;
