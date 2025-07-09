"use client";

import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/format";

interface CourseEnrollButtonProps {
    amount: string;
    courseId: string;
}
export const CourseEnrollButton = ({
    amount,
    // courseId,
}: CourseEnrollButtonProps) => {
    return (
        <Button
            size={"sm"}
            className="w-full md:w-auto"
        >
            Enroll for {formatAmount(amount)}
        </Button>
    )
}