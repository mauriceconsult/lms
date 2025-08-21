// app/(course)/courses/[courseId]/_components/CourseActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CourseActions = ({
  courseId,
  isFree,
}: {
  courseId: string;
  isFree: boolean;
}) => {
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      if (isFree) {
        await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
        router.push(`/courses/${courseId}/tutors`);
      } else {
        router.push(`/courses/${courseId}/checkout`);
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()} CourseActions] Enrollment error:`,
        error
      );
    }
  };

  return (
    <Button onClick={handleEnroll} className="mb-4">
      {isFree ? "Enroll for Free" : "Purchase Course"}
    </Button>
  );
};
