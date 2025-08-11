"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Assignment } from "@prisma/client";
import { TutorAssignmentList } from "./tutor-assignment-list";


interface TutorAssignmentFormProps {
  initialData: {
    assignments: Assignment[];
  };
  courseId: string;
  facultyId: string;
  tutorId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const TutorAssignmentForm = ({
  initialData,
  courseId,
  facultyId,
  tutorId,
}: TutorAssignmentFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            position: initialData.assignments.length + 1,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      toast.success("Assignment created.");
      toggleCreating();
      reset({ title: "" });
      router.refresh();
    } catch (error) {
      console.error("Create assignment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unexpected error occurred"
      );
    }
  };

  const onEditAction = async (id: string) => {
    try {
      router.push(
        `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/assignment/${id}`
      );
      return { success: true, message: "Navigating to edit assignment" };
    } catch (error) {
      console.error("Edit assignment error:", error);
      return {
        success: false,
        message: "Failed to navigate to edit assignment",
      };
    }
  };

  const onReorderAction = async (
    updateData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}/assignments/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updateData }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reorder assignments");
      }

      toast.success("Assignments reordered.");
      return { success: true, message: "Assignments reordered successfully" };
    } catch (error) {
      console.error("Reorder assignment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unexpected error occurred"
      );
      return { success: false, message: "Failed to reorder assignments" };
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div
          className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Topic Assignments*
        <Button
          onClick={toggleCreating}
          variant="ghost"
          disabled={isSubmitting}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an Assignment
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Assignment 1: Introduction'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.assignments.length && "text-slate-500 italic"
          )}
        >
          {!initialData.assignments.length &&
            "Add Assignment(s) here. Ideally, each Topic should be accompanied by an Assignment."}
          <TutorAssignmentList
            onEditAction={onEditAction}
            onReorderAction={onReorderAction}
            items={initialData.assignments || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Assignments
        </p>
      )}
    </div>
  );
};
