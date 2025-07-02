"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface FacultyPayrollActionsProps {
  disabled: boolean;
  facultyPayrollId: string;
  payrollId: string;
  isPublished: boolean;
}

export const FacultyPayrollActions = ({
  disabled,
  facultyPayrollId,
  payrollId,
  isPublished,
}: FacultyPayrollActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/create-payrolls/${payrollId}/facultyPayrolls/${facultyPayrollId}/unpublish`
        );
        toast.success("FacultyPayroll unpublished");
      } else {
        await axios.patch(
          `/api/create-payrolls/${payrollId}/facultyPayrolls/${facultyPayrollId}/publish`
        );
        toast.success("FacultyPayroll published");
      }
        router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/create-payrolls/${payrollId}/facultyPayrolls/${facultyPayrollId}`);
      toast.success("FacultyPayroll deleted");
      router.refresh();
      router.push(`/payroll/create-payroll/${payrollId}/facultyPayroll`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
