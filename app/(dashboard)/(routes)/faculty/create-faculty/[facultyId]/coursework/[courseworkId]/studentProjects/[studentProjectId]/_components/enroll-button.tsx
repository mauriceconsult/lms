"use client";

import { Button } from "@/components/ui/button";
// import { formatAmount } from "@/lib/format";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

interface EnrollButtonProps {
  formatAmount: (amount: number) => string;
  tuitionId: string;
}
export const CourseEnrollButton = ({
  formatAmount,
  tuitionId,
}: EnrollButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading  ] = React.useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/faculty/${tuitionId}/checkout`);
      router.push(`/tuition/create-student-tuition/${tuitionId}/receipts/${response.data.id}`)
      // window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium">Enroll in this course</div>
      <div className="flex flex-col gap-y-2">
      
        <Button 
          onClick={onClick}
          disabled={isLoading}
            className="w-[200px] inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            aria-disabled={isLoading}
          >
            Enroll for {formatAmount(100)} {/* Replace 100 with the actual amount */}
          </Button>
      
      </div>
    </div>
  );
};
