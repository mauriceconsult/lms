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

  const handleBack = () => {
    console.log(`[${new Date().toISOString()} EnrollButton] Navigating back`);
    router.back();
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md text-center">
        Enroll for full access to the Course
      </div>
      <Button
        onClick={handleBack}
        variant="outline"
        className="w-full md:w-auto"
      >
        Back
      </Button>
      <div className="flex justify-end">
        <Button
          onClick={handleEnroll}
          className="mt-4 bg-blue-600 text-white w-full md:w-auto"
        >
          Course Enroll
        </Button>
      </div>
    </div>
  );
}
