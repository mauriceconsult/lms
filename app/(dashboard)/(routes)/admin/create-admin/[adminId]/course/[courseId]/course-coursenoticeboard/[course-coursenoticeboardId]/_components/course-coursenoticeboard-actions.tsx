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
  adminId: string;
  courseId: string;
  courseCourseNoticeboardId: string;
  isPublished: boolean;
}
export const CourseCourseNoticeboardActions = ({
  disabled,
  adminId,
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
        await axios.patch(`/api/create-faculties/${adminId}/courses/${courseId}/course-course-noticeboards/${courseCourseNoticeboardId}/unpublish`);
        toast.success("Course Noticeboard unpublished");
      } else {
        await axios.patch(
          `/api/create-faculties/${adminId}/courses/${courseId}/course-course-noticeboards/${courseCourseNoticeboardId}/publish`
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
        `/api/create-admin/${adminId}/courses/${courseId}/course-course-noticeboards/${courseCourseNoticeboardId}`
      );
      toast.success("Course Noticeboard deleted");
      router.refresh();
      router.push(
        `/admin/create-admin/${adminId}/course/${courseId}/course-course-noticeboard`
      );
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
