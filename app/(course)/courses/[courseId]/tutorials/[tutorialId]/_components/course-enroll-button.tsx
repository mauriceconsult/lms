"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/format";

interface CourseEnrollButtonProps {
  courseId: string;
  amount: string;
}

export default function CourseEnrollButton({
  courseId,
  amount,
}: CourseEnrollButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/courses/${courseId}/checkout`)}
      className="bg-slate-800 text-white hover:bg-slate-900"
    >
      Enroll for {formatAmount(amount)}
    </Button>
  );
}