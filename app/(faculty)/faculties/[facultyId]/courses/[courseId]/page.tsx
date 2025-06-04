import { getCourse } from "@/actions/get-course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: { facultyId: string; courseId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    course,
    faculty,
    // attachments,
    // nextCourse,
    // progressCount,
  } = await getCourse({
    userId,
    facultyId: params.facultyId,
    courseId: params.courseId,
  });
  if (!course || !faculty) {
    return redirect("/");
  }
  return <div>Course Id page</div>;
};

export default CourseIdPage;
