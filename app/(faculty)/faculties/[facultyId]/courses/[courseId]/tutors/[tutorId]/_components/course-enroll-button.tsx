"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  amount: string | null;
}

export function CourseEnrollButton({
  courseId,
  amount,
}: CourseEnrollButtonProps) {
  const router = useRouter();

  const onClick = async () => {
    try {
      // Simulate enrollment API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        `Enrolled in course! ${amount ? `Amount: €${amount}` : "Free course"}`
      );
      router.push(`/courses/${courseId}/enrolled`);
    } catch {
      toast.error("Failed to enroll in course");
    }
  };

  return (
    <Button onClick={onClick} disabled={!amount}>
      Enroll Now {amount ? `(€${amount})` : "(Free)"}
    </Button>
  );
}
