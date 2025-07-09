"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseNoticeboardActionsProps {
  disabled: boolean;
  facultyId: string;
  courseId: string;
  courseNoticeboardId: string;
  isPublished: boolean;
}

export const CourseNoticeboardActions = ({
  disabled,
  facultyId,
  courseId,
  courseNoticeboardId,
  isPublished,
}: CourseNoticeboardActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/courseNoticeboards/${courseNoticeboardId}/unpublish`
        );
        toast.success("Course notice unpublished");
      } else {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/courseNoticeboards/${courseNoticeboardId}/publish`
        );
        
        toast.success("Course notice published");
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
      await axios.delete(`/api/create-faculties/${facultyId}/courses/${courseId}/courseNoticeboards/${courseNoticeboardId}`);
      toast.success("Course notice deleted");
      router.refresh();
      router.push(`/faculty/create-faculty/${facultyId}/course/${courseId}/courseNoticeboard`);
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
