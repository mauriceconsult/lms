
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { CourseWithProgressWithAdmin } from "@/actions/get-dashboard-courses";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// interface CourseCardProps {
//   course: CourseWithProgressWithAdmin;
// }

// export function CourseCard({ course }: CourseCardProps) {
//   const { id, title, progress, tuition, admin, tutors, imageUrl, description } = course;
//   const formattedProgress = typeof progress === 'number' ? progress.toFixed(2) : "0.00";
//   const paymentStatus = tuition?.status ?? "Not Enrolled";
//   const amount = tuition?.amount && /^[0-9]+(\.[0-9]{1,2})?$/.test(tuition.amount)
//     ? parseFloat(tuition.amount).toFixed(2)
//     : "0.00";
//   const adminName = admin?.title ?? "No Admin";
//   const tutorTitles =
//     tutors.length > 0
//       ? tutors.map((tutor) => tutor.title).join(", ")
//       : "No Tutors";
//   const courseImage = imageUrl ?? "/placeholder.png";
//   const courseDescription = description ?? "No description available";

//   console.log('CourseCard imageUrl:', { courseId: id, imageUrl });

//   return (
//     <Link
//       href={`/courses/${id}`}
//       className="block"
//       onClick={() => console.log(`[${new Date().toISOString()} CourseCard] Navigating to /courses/${id}`)}
//     >
//       <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
//         <CardHeader>
//           <CardTitle className="hover:underline">{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             <div className="relative w-full h-40">
//               <Image
//                 src={courseImage}
//                 alt={`${title} image`}
//                 fill
//                 sizes="(max-width: 640px) 100vw, 320px"
//                 objectFit="cover"
//                 className="rounded-md"
//                 placeholder="blur"
//                 blurDataURL="/placeholder.png"
//               />
//             </div>
//             <div>
//               <span className="font-semibold">Description:</span> {courseDescription}
//             </div>
//             <div>
//               <span className="font-semibold">Progress:</span> {formattedProgress}%
//             </div>
//             <Progress value={progress ?? 0} />
//             <div>
//               <span className="font-semibold">Payment Status:</span> {paymentStatus}
//             </div>
//             <div>
//               <span className="font-semibold">Amount:</span> ${amount}
//             </div>
//             <div>
//               <span className="font-semibold">Admin:</span> {adminName}
//             </div>
//             <div>
//               <span className="font-semibold">Tutors:</span> {tutorTitles}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }
