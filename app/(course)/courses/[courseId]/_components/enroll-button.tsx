"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
  courseId: string;
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();

  const handleEnroll = () => {
    console.log(
      `[${new Date().toISOString()} EnrollButton] Navigating to /courses/${courseId}/payment`
    );
    router.push(`/courses/${courseId}/payment`);
  };

  return (
    <Button onClick={handleEnroll} className="mt-4 bg-blue-600 text-white">
      Course Enroll
    </Button>
  );
}
