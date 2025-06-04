import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNotice } from "@/actions/get-notice";
import FacultyNoticeImage from "./_components/faculty-notice-image";

const CourseIdPage = async ({
  params,
}: {
  params: {
    facultyId: string;
    courseId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { title, imageUrl, description, facultyId } = await getNotice({
    userId,
    courseId: params.courseId,
    facultyId: params.facultyId,
  });
  if (!title || !imageUrl || !description || !facultyId) {
    return redirect("/");
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Banner label="Notice Board" variant="warning" />
      <div className="mt-6">
    <FacultyNoticeImage title={""} courseId={""} facultyId={""}     
    />
      </div>
      </div>
  );
};

export default CourseIdPage;
