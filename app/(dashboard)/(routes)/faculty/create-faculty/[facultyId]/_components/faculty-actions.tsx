"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface FacultyActionsProps {
  disabled: boolean;
  facultyId: string;
  isPublished: boolean;
}
export const FacultyActions = ({
  disabled,
  facultyId,
  isPublished,
}: FacultyActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/create-faculties/${facultyId}/unpublish`);
        toast.success("Faculty unpublished");
      } else {
        await axios.patch(`/api/create-faculties/${facultyId}/publish`);
        toast.success("Faculty published");
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
      await axios.delete(`/api/create-faculties/${facultyId}`);
      toast.success("Faculty deleted");
      router.refresh();
      router.push(`/faculty/create-faculty`);
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
