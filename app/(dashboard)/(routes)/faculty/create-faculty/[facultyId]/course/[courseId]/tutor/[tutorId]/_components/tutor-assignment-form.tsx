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
import { Assignment, Tutor } from "@prisma/client";
import { TutorAssignmentList } from "./tutor-assignment-list";
import { createAssignment, onEditAction, onReorderAction } from "../assignment/[assignmentId]/actions";

interface TutorAssignmentFormProps {
  initialData: Tutor & { assignments: Assignment[] };
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

  console.log("TutorAssignmentForm props:", { tutorId, courseId, facultyId });

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
      console.log("Creating assignment with:", { tutorId, values, facultyId, courseId });
      const { success, message, data } = await createAssignment(tutorId, values, facultyId, courseId);
      console.log("Create assignment response:", { success, message, data });
      if (success) {
        toast.success(message);
        toggleCreating();
        reset({ title: "" });
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Create assignment error:", error);
      toast.error("Unexpected error occurred");
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
        Tutorial assignment*
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
              Add a tutorial Assignment
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
                      placeholder="e.g., 'Principles of Fashion Design'"
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
            "At least one published Assignment is required. A tutorial assignment examines the student's understanding of the uploaded video's content."}
          <TutorAssignmentList
            onEditAction={async (id) => {
              console.log("Editing assignment with:", { tutorId, assignmentId: id, facultyId, courseId });
              const result = await onEditAction(tutorId, id, facultyId, courseId);
              console.log("Edit action response:", result);
              if (result.success) {
                router.push(
                  `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/assignment/${id}`
                );
              }
              return result;
            }}
            onReorderAction={async (updateData) => {
              console.log("Reordering assignments with:", { tutorId, updateData, facultyId, courseId });
              setIsUpdating(true);
              const result = await onReorderAction(tutorId, updateData, facultyId, courseId);
              console.log("Reorder action response:", result);
              setIsUpdating(false);
              router.refresh();
              return result;
            }}
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