"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CourseNavbar from "./_components/course-navbar";
import { auth } from "@clerk/nextjs/server";

export default function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { userId } = await auth();
      if (!userId) {
        toast.error("Error, Please sign in.");
        router.push("/sign-in");
        return;
      }

      const { courseId } = await params;
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { amount: true, isPublished: true },
      });

      if (!course) {
        toast.error("Error, Course not found.");
        return;
      }

      if (!course.isPublished) {
         toast.error("Error, Course not available.");
        return;
      }

      if (!course.amount) {
         toast.error("Error, Course amount not set.");
        return;
      }

      const formattedAmount = course.amount; // Already a string from schema
      const response = await fetch(
        `/api/faculties/test-faculty-id/courses/${courseId}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partyId: phoneNumber,
            amount: formattedAmount,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Payment Successful, You are now enrolled!");
        if (data.firstTutorId) {
          router.push(`/tutor/${data.firstTutorId}`);
        }
      } else {
        toast.error( "Payment Failed, Payment error");
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()} CoursePage] Checkout error:`,
        error
      );
      toast.error("Error, An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseNavbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Course Enrollment</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pay with MTN MoMo</h2>
          <input
            type="text"
            placeholder="Enter MoMo phone number (e.g., 256123456789)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            disabled={loading}
          />
          <button
            onClick={handleCheckout}
            disabled={loading || !phoneNumber}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin inline" />
            ) : (
              "Enroll Now"
            )}
          </button>
        </div>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Courses
        </Link>
      </div>
    </div>
  );
}
