// // app/courses/[courseId]/payment/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-hot-toast";

// interface FormData {
//   msisdn: string;
//   username?: string;
// }

// interface Course {
//   id: string;
//   title: string;
//   amount: string;
//   facultyId: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data?: Course;
//   message?: string;
// }

// const TuitionPaymentPage = () => {
//   const [formData, setFormData] = useState<FormData>({ msisdn: "" });
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [tuitionCreated, setTuitionCreated] = useState(false);
//   const router = useRouter();
//   const { isSignedIn, user } = useUser();
//   const params = useParams<{ courseId: string }>();

//   useEffect(() => {
//     console.log(`[${new Date().toISOString()} TuitionPaymentPage] Params:`, params);
//     if (!isSignedIn || !user?.id) {
//       console.error(
//         `[${new Date().toISOString()} TuitionPaymentPage] User not signed in`
//       );
//       router.push("/sign-in");
//       return;
//     }

//     if (!params.courseId) {
//       console.error(
//         `[${new Date().toISOString()} TuitionPaymentPage] No courseId provided`
//       );
//       toast.error("Missing course ID");
//       return;
//     }

//     const fetchCourse = async (retryCount = 0) => {
//       try {
//         const url = `${
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
//         }/api/courses/${params.courseId}`;
//         console.log(`[${new Date().toISOString()} TuitionPaymentPage] Fetching course from:`, url);
//         const response = await fetch(url, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         });
//         console.log(`[${new Date().toISOString()} TuitionPaymentPage] Fetch status: ${response.status}`);
//         if (!response.ok) {
//           const errorText = await response.text();
//           const errorMessage = `Course fetch failed: ${response.status} ${errorText || response.statusText}`;
//           if (response.status === 404) {
//             throw new Error("Course not found");
//           }
//           if (response.status >= 500 && retryCount < 2) {
//             console.log(`[${new Date().toISOString()} TuitionPaymentPage] Retrying (${retryCount + 1}/2)...`);
//             setTimeout(() => fetchCourse(retryCount + 1), 1000);
//             return;
//           }
//           throw new Error(errorMessage);
//         }
//         const result: ApiResponse = await response.json();
//         console.log(`[${new Date().toISOString()} TuitionPaymentPage] Course response:`, JSON.stringify(result, null, 2));
//         if (!result.success || !result.data) {
//           throw new Error(result.message || "Failed to load course");
//         }
//         const amountNum = Number(result.data.amount);
//         console.log(`[${new Date().toISOString()} TuitionPaymentPage] Parsed amount: ${amountNum}`);
//         if (!result.data.amount || isNaN(amountNum) || amountNum <= 0) {
//           throw new Error(`Course amount is invalid or missing: ${result.data.amount}`);
//         }
//         setCourse(result.data);
//       } catch (error: unknown) {
//         const errorMessage =
//           error instanceof Error ? error.message : "Unexpected error occurred";
//         console.error(
//           `[${new Date().toISOString()} TuitionPaymentPage] Error fetching course:`,
//           error
//         );
//         toast.error(
//           errorMessage.includes("Course not found")
//             ? "The requested course does not exist."
//             : `Failed to load course details: ${errorMessage}`
//         );
//       }
//     };

//     fetchCourse();
//   }, [isSignedIn, user, params, router]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isSignedIn || !user?.id) {
//       router.push("/sign-in");
//       return;
//     }
//     if (!params.courseId || !course?.facultyId) {
//       toast.error("Missing course or faculty information");
//       return;
//     }
//     if (!formData.msisdn.match(/^256\d{9}$/)) {
//       toast.error("Phone number must be in format 256123456789 (12 digits)");
//       return;
//     }
//     const amountNum = Number(course?.amount);
//     if (!course?.amount || isNaN(amountNum) || amountNum <= 0) {
//       toast.error(`Course amount is invalid or missing: ${course?.amount}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `/api/faculties/${course.facultyId}/courses/${params.courseId}/tuition`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             msisdn: formData.msisdn,
//             username: formData.username,
//             userId: user.id,
//             amount: course.amount, // String for MoMo
//           }),
//         }
//       );
//       const result = await response.json();
//       console.log(`[${new Date().toISOString()} TuitionPaymentPage] Tuition creation response:`, JSON.stringify(result, null, 2));
//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Failed to create tuition");
//       }
//       toast.success("Student account created! Proceed to payment.");
//       setTuitionCreated(true);
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Unexpected error occurred";
//       console.error(
//         `[${new Date().toISOString()} TuitionPaymentPage] Error creating tuition:`,
//         error
//       );
//       toast.error(`Failed to create student account: ${errorMessage}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayNow = () => {
//     if (!course?.facultyId) {
//       toast.error("Missing faculty information");
//       return;
//     }
//     router.push(
//       `/courses/${params.courseId}/payment/options?facultyId=${course.facultyId}`
//     );
//   };

//   if (!isSignedIn || !user?.id) {
//     return <div className="p-6">Please sign in to proceed with payment.</div>;
//   }

//   if (!course) {
//     return <div className="p-6">Loading course details...</div>;
//   }

//   return (
//     <div className="p-6">
//       <Card className="border bg-slate-50">
//         <CardHeader>
//           <CardTitle className="text-2xl font-medium">
//             Create a student account for instant access to {course.title}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="msisdn" className="text-sm font-medium">
//                 Enter phone number
//               </label>
//               <Input
//                 id="msisdn"
//                 name="msisdn"
//                 value={formData.msisdn}
//                 onChange={handleInputChange}
//                 placeholder="256123456789"
//                 required
//                 pattern="256\d{9}"
//                 className="mt-1"
//                 disabled={tuitionCreated}
//               />
//             </div>
//             <div>
//               <label htmlFor="username" className="text-sm font-medium">
//                 Username (optional)
//               </label>
//               <Input
//                 id="username"
//                 name="username"
//                 value={formData.username || ""}
//                 onChange={handleInputChange}
//                 placeholder="Enter username"
//                 className="mt-1"
//                 disabled={tuitionCreated}
//               />
//             </div>
//             {tuitionCreated ? (
//               <Button onClick={handlePayNow} className="w-full">
//                 Pay Now
//               </Button>
//             ) : (
//               <Button
//                 type="submit"
//                 disabled={loading || !course || !course.amount || Number(course.amount) <= 0}
//                 className="w-full"
//               >
//                 {loading
//                   ? "Processing..."
//                   : `Create Account and Proceed to Pay ${course.amount} EUR`}
//               </Button>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TuitionPaymentPage;