import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const course = await db.course.findUnique({
    where: {
      id: (await params).courseId,
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
        return redirect("/");
    }
  return redirect(`/courses/${course.id}/tutorials/${course.tutors[0].id}`)
};

export default CourseIdPage;
