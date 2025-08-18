// app/courses/[courseId]/payment/options/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  amount: number;
  facultyId: string;
}

interface Tuition {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  msisdn: string;
  username: string | null;
}

const PaymentOptionsPage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId");

  useEffect(() => {
    if (!params.courseId || !facultyId) {
      toast.error("Missing course or faculty information");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${params.courseId}`, {
          credentials: "include",
        });
        if (!courseResponse.ok)
          throw new Error(`Course fetch failed: ${courseResponse.status}`);
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch tuition details
        const tuitionResponse = await fetch(
          `/api/faculties/${facultyId}/courses/${params.courseId}/tuition`,
          { credentials: "include" }
        );
        if (!tuitionResponse.ok)
          throw new Error(`Tuition fetch failed: ${tuitionResponse.status}`);
        const tuitionData = await tuitionResponse.json();
        setTuition(tuitionData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load payment options");
      }
    };

    fetchData();
  }, [params.courseId, facultyId]);

  const handleMoMoPayment = async () => {
    if (!isSignedIn || !course || !tuition || !facultyId) {
      toast.error("Missing required information");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/faculties/${facultyId}/courses/${params.courseId}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            msisdn: tuition.msisdn,
            amount: course.amount,
            partyId: tuition.msisdn,
            username: tuition.username,
            userId: user?.id,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Payment failed");
      }
      toast.success("Payment successful! Enrolling in course...");
      router.push(`/tutor/${result.firstTutorId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      console.error(
        `[${new Date().toISOString()} PaymentOptionsPage] Error:`,
        error
      );
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return <div className="p-6">Please sign in to proceed with payment.</div>;
  }

  if (!course || !tuition) {
    return <div className="p-6">Loading payment options...</div>;
  }

  return (
    <div className="p-6">
      <Card className="border bg-slate-50">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Select Payment Option for {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Amount: {course.amount} EUR</p>
            <Button
              onClick={handleMoMoPayment}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Pay with MoMo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptionsPage;
