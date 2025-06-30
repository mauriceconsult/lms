"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface TuitionActionsProps {
  disabled: boolean;
  facultyId: string;
  courseId: string;
  tuitionId: string;
  isPaid: boolean;
}

export const TuitionActions = ({
  disabled,
  facultyId,
  courseId,
  tuitionId,
  isPaid,
}: TuitionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPaid) {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/tuitions/${tuitionId}/unpublish`
        );
        toast.success("Tuition unpublished");
      } else {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/tuitions/${tuitionId}/publish`
        );
        
        toast.success("Tuition published");
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
      await axios.delete(`/api/create-faculties/${facultyId}/courses/${courseId}/tuitions/${tuitionId}`);
      toast.success("Tuition deleted");
      router.refresh();
      router.push(`/faculty/create-faculty/${facultyId}/course/${courseId}/tuition`);
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
        {isPaid ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
