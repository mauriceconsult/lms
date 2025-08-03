import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { utapi } from "@/lib/uploadthing"; // Assume UTApi is initialized

export default async function SubmitCourseworkPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseworkId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { facultyId, courseworkId } = await params;

  const coursework = await db.coursework.findUnique({
    where: { id: courseworkId },
  });
  if (!coursework || coursework.facultyId !== facultyId) redirect("/");

  const handleSubmit = async (formData: FormData) => {
    const file = formData.get("file") as File;
    const uploadRes = await utapi.uploadFiles([file], {
      uploadRoute: "courseAttachment",
    });
    const fileUrl = uploadRes[0]?.url;

    await db.submission.create({
      data: {
        id: crypto.randomUUID(),
        courseworkId,
        studentId: userId,
        fileUrl,
      },
    });
    redirect(`/faculties/${facultyId}/courseworks/${courseworkId}`);
  };

  return (
    <div className="p-6">
      <h1>Submit for {coursework.title}</h1>
      <form action={handleSubmit}>
        <input type="file" name="file" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
