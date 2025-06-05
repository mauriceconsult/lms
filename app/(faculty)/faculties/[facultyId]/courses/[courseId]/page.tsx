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
  return (
    <div>
      <h1>Course ID: {params.courseId}</h1>
      <p>Faculty ID: {params.facultyId}</p>
      {/* Additional content can be added here */}
      <p>Faculty Page</p>
      {/* You can fetch and display course details here */}
      <p>This is a placeholder for the course content.</p>
      {/* You can add more components or content as needed */}
    </div>
  );
};

export default CourseIdPage;
