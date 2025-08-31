/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { markTutorialCompleted } from "../actions";

interface ProgressButtonProps {
  userId: string;
  tutorialId: string;
  courseId: string;
  isCompleted: boolean;
}

export default function ProgressButton({
  userId,
  tutorialId,
  courseId,
  isCompleted,
}: ProgressButtonProps) {
  const initialState = {
    success: false,
    error: undefined as string | undefined,
  };

  const [state, formAction, isPending] = useActionState(
    async (
    
      prevState: { success: boolean; error?: string },
    
      formData: FormData
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await markTutorialCompleted({ userId, tutorialId, courseId });
        return { success: true, error: undefined };
      } catch (error) {
        return { success: false, error: "Failed to mark as completed" };
      }
    },
    initialState
  );

  if (isCompleted) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-6 h-6 mr-2" />
        <span>Completed</span>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state.error && <p className="text-red-500 mb-2">{state.error}</p>}
      <Button
        type="submit"
        className="bg-slate-800 text-white hover:bg-slate-900"
        disabled={isPending}
      >
        {isPending ? "Marking..." : "Mark as Completed"}
      </Button>
    </form>
  );
}
