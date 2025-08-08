"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CourseEnrollButtonProps {
  courseId: string;
  amount: string | null; // Updated to allow null
}

export const CourseEnrollButton = ({
  courseId,
  amount,
}: CourseEnrollButtonProps) => {
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      // Assume API call to handle payment and enrollment
      await fetch(`/api/enroll/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, amount: amount || "0.00" }),
      });
      router.refresh();
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  return (
    <Button onClick={handleEnroll} className="bg-green-600 hover:bg-green-700">
      Enroll Now
    </Button>
  );
};
