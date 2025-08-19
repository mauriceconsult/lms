// // app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/tutors/page.tsx
// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { DashboardLayout } from "@/components/dashboard-layout";
// import { AssignmentsList } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/[tutorId]/assignment/[assignmentId]/search/_components/assignments-list";

// const TutorsPage = async ({
//   params,
// }: {
//   params: Promise<{
//     facultyId: string;
//     courseId: string;
//   }>;
// }) => {
//   const { userId } = await auth();
//   if (!userId) {
//     return redirect("/");
//   }

//   const resolvedParams = await params;
//   const tutors = await db.tutor.findMany({
//     where: {
//       courseId: resolvedParams.courseId,
//       isPublished: true,
//     },
//     include: {
//       assignments: {
//         where: { isPublished: true },
//         include: { tutor: true },
//       },
//     },
//   });

//   const tuition = await db.tuition.findUnique({
//     where: {
//       userId_courseId: {
//         userId,
//         courseId: resolvedParams.courseId,
//       },
//     },
//   });

//   if (!tuition || !tuition.isActive) {
//     return redirect(
//       `/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}`
//     );
//   }

//   const progressData = await Promise.all(
//     tutors.map(async (tutor) => {
//       const assignments = tutor.assignments;
//       const completedAssignments = await db.userProgress.count({
//         where: {
//           userId,
//           assignmentId: { in: assignments.map((a) => a.id) },
//           isCompleted: true,
//         },
//       });
//       const progress =
//         assignments.length > 0
//           ? (completedAssignments / assignments.length) * 100
//           : 0;
//       return { tutorId: tutor.id, progress };
//     })
//   );

//   return (
//     <DashboardLayout
//       facultyId={resolvedParams.facultyId}
//       courseId={resolvedParams.courseId}
//     >
//       <div className="flex">
//         <div className="w-1/4 p-4 border-r">
//           <h2 className="text-xl font-medium">Progress</h2>
//           {progressData.map(({ tutorId, progress }) => (
//             <div key={tutorId} className="mt-4">
//               <Link
//                 href={`/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}/tutor/${tutorId}`}
//               >
//                 <p>Tutor ID: {tutorId.slice(0, 8)}...</p>
//                 <p>Progress: {progress.toFixed(2)}%</p>
//               </Link>
//             </div>
//           ))}
//         </div>
//         <div className="w-3/4 p-6">
//           <h1 className="text-2xl font-medium">Tutors</h1>
//           {tutors.map((tutor) => (
//             <div key={tutor.id} className="mt-4">
//               <Link
//                 href={`/faculty/create-faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}/tutor/${tutor.id}`}
//               >
//                 <h3>{tutor.title}</h3>
//                 <p>{tutor.description || "No description"}</p>{" "}
//                 {/* Render description directly */}
//               </Link>
//               <AssignmentsList item={tutor.assignments} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default TutorsPage;
