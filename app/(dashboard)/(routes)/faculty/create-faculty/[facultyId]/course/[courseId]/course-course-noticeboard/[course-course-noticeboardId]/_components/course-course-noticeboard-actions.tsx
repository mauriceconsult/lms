"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseCourseNoticeboardActionsProps {
  disabled: boolean;
  facultyId: string;
  courseId: string;
  courseCourseNoticeboardId: string;
  isPublished: boolean;
}
export const CourseCourseNoticeboardActions = ({
  disabled,
  facultyId,
  courseId,
  courseCourseNoticeboardId,
  isPublished,
}: CourseCourseNoticeboardActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/create-faculties/${facultyId}/courses/${courseId}/courseCourseNoticeboards/${courseCourseNoticeboardId}/unpublish`);
        toast.success("Course Noticeboard unpublished");
      } else {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/courseCourseNoticeboards/${courseCourseNoticeboardId}/publish`
        );
        toast.success("Course Noticeboard published");
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
      await axios.delete(
        `/api/create-faculty/${facultyId}/courses/${courseId}/courseNoticeboards/${courseCourseNoticeboardId}`
      );
      toast.success("Course Noticeboard deleted");
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
