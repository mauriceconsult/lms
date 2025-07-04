"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface TutorAssignmentActionsProps {
  disabled: boolean;
  facultyId: string;
  courseId: string;
  assignmentId: string;
  tutorAssignmentId: string;
  isSubmitted: boolean;
}

export const TutorAssignmentActions = ({
  disabled,
  facultyId,
  courseId,
  assignmentId,
  tutorAssignmentId,
  isSubmitted,
}: TutorAssignmentActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isSubmitted) {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/assignments/${assignmentId}/tutorAssignments/${tutorAssignmentId}/unpublish`
        );
        toast.success("Tutor Assignment unpublished");
      } else {
        await axios.patch(
          `/api/create-faculties/${facultyId}/courses/${courseId}/assignments/${assignmentId}/tutorAssignments/${tutorAssignmentId}/publish`
        );
        
        toast.success("TutorAssignment published");
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
        `/api/create-faculties/${facultyId}/courses/${courseId}/assignments/${assignmentId}/tutorAssignments/${tutorAssignmentId}`
      );
      toast.success("Tutor Assignment deleted");
      router.refresh();
      router.push(
        `/faculty/create-faculty/${facultyId}/course/${courseId}/assignment/${assignmentId}/tutorAssignment`
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
        {isSubmitted ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
