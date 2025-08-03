// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { utapi } from "@/lib/uploadthing";
// import { input } from "zod";

// export default async function SubmitCourseworkPage({
//   params,
// }: {
//   params: Promise<{ facultyId: string; courseworkId: string }>;
// }) {
//   const { userId } = await auth();
//   if (!userId) redirect("/");

//   const { facultyId, courseworkId } = await params;

//   const coursework = await db.coursework.findUnique({
//     where: { id: courseworkId },
//     select: { id: true, facultyId: true, title: true, courseId: true }, // Optimize query
//   });
//   if (!coursework || coursework.facultyId !== facultyId) redirect("/");

//   const isEnrolled = coursework.courseId
//     ? await db.enrollment.findFirst({
//         where: { studentId: userId, courseId: coursework.courseId },
//       })
//     : null;
//   if (!isEnrolled) redirect("/");

//   const handleSubmit = async (formData: FormData) => {
//     const file = formData.get("file") as File | null;
//     if (!file) throw new Error("No file uploaded");

//     const uploadRes = await utapi.uploadFiles([file], {
//       uploadRoute: "courseAttachment",
//     });
//     const fileUrl = uploadRes[0]?.url;
//     if (!fileUrl) throw new Error("Upload failed");

//     await db.submission.create({
//       data: {
//         id: crypto.randomUUID(),
//         courseworkId,
//         studentId: userId,
//         fileUrl,
//       },
//     });
//     redirect(`/faculties/${facultyId}/courseworks/${courseworkId}`);
//   };

//   return (
//     <div className="p-6">
//       <h1>Submit for {coursework.title || "Untitled Coursework"}</h1>
//       <form action={handleSubmit} className="mt-4 space-y-4">
//         <input
//           type="file"
//           name="file"
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }
