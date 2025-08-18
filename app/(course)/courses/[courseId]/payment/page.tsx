// app/courses/[courseId]/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface FormData {
  msisdn: string;
  username?: string;
}

interface Course {
  id: string;
  title: string;
  amount: number;
  facultyId: string;
}

const TuitionPaymentPage = () => {
  const [formData, setFormData] = useState<FormData>({ msisdn: "" });
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [tuitionCreated, setTuitionCreated] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const params = useParams<{ courseId: string }>();

  useEffect(() => {
    console.log("Params:", params);
    if (!params.courseId) {
      toast.error("Missing course ID");
      return;
    }

    const fetchCourse = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/courses/${params.courseId}`;
        console.log("Fetching course from:", url);
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok)
          throw new Error(
            `Fetch failed: ${response.status} ${response.statusText}`
          );
        const data = await response.json();
        console.log("Course data:", data);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
      }
    };

    fetchCourse();
  }, [params.courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!params.courseId || !course?.facultyId) {
      toast.error("Missing course or faculty information");
      return;
    }
    if (!formData.msisdn.match(/^256\d{7}$/)) {
      toast.error("Phone number must be in format 2561234567");
      return;
    }
    if (!course?.amount) {
      toast.error("Course amount not available");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/faculties/${course.facultyId}/courses/${params.courseId}/tuition`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            msisdn: formData.msisdn,
            username: formData.username,
            userId: user?.id,
            amount: course.amount,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create tuition");
      }
      toast.success("Student account created! Proceed to payment.");
      setTuitionCreated(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      console.error(
        `[${new Date().toISOString()} TuitionPaymentPage] Error:`,
        error
      );
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    if (!course?.facultyId) {
      toast.error("Missing faculty information");
      return;
    }
    router.push(
      `/courses/${params.courseId}/payment/options?facultyId=${course.facultyId}`
    );
  };

  if (!isSignedIn) {
    return <div className="p-6">Please sign in to proceed with payment.</div>;
  }

  if (!course) {
    return <div className="p-6">Loading course details...</div>;
  }

  return (
    <div className="p-6">
      <Card className="border bg-slate-50">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Create a student account for instant access to {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="msisdn" className="text-sm font-medium">
                Enter phone number
              </label>
              <Input
                id="msisdn"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleInputChange}
                placeholder="2561234567"
                required
                pattern="256\d{7}"
                className="mt-1"
                disabled={tuitionCreated}
              />
            </div>
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username (optional)
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="mt-1"
                disabled={tuitionCreated}
              />
            </div>
            {tuitionCreated ? (
              <Button onClick={handlePayNow} className="w-full">
                Pay Now
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !course}
                className="w-full"
              >
                {loading
                  ? "Processing..."
                  : `Create Account and Proceed to Pay ${course.amount} EUR`}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TuitionPaymentPage;
