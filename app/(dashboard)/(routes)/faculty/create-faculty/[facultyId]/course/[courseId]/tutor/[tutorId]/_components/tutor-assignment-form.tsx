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
import {
  createAssignment,
  onEditAction,
  onReorderAction,
} from "../assignments/[assignmentId]/actions";

interface TutorAssignmentFormProps {
  initialData: Tutor & { assignments: Assignment[] };
  facultyId: string;
  courseId: string;
  tutorId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const TutorAssignmentForm = ({
  initialData,
  facultyId,
  courseId,
  tutorId,
}: TutorAssignmentFormProps) => {
  console.log("TutorAssignmentForm mounted");

  let renderCount = 0;
  console.log("Render count:", ++renderCount);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  console.log("Current isCreating state:", isCreating);

  const toggleCreating = () => {
    setIsCreating((current) => {
      console.log("Toggling isCreating to:", !current);
      return !current;
    });
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const {
    reset,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = form;

  // Log validation
  const values = watch();
  console.log("Zod validation:", formSchema.safeParse(values));
  console.log("Form state:", { isValid, isSubmitting, errors, values });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    try {
      const response = await createAssignment(tutorId, values);
      console.log("createAssignment response:", response);
      if (response.success) {
        toast.success(response.message);
        toggleCreating();
        reset({ title: "" });
        router.refresh();
      } else {
        toast.error(response.message);
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
        Assignment*
        <Button
          onClick={() => {
            console.log(
              "Add an Assignment clicked, isSubmitting:",
              isSubmitting,
              "current isCreating:",
              isCreating
            );
            toggleCreating();
          }}
          variant="ghost"
          disabled={isSubmitting}
          aria-label={
            isCreating ? "Cancel adding assignment" : "Add an Assignment"
          }
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
        <div>
          {(() => {
            console.log("Rendering form");
            return null;
          })()}
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
                        placeholder="e.g., 'Intro to Fashion Design: Assignment 1'"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          console.log(
                            "Input changed, new value:",
                            e.target.value,
                            "isValid:",
                            form.formState.isValid,
                            "errors:",
                            form.formState.errors
                          );
                        }}
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
        </div>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.assignments.length && "text-slate-500 italic"
          )}
        >
          {!initialData.assignments.length &&
            "Add Assignments here. At least one published Assignment is required for every Tutor/Topic."}
          <TutorAssignmentList
            onEditAction={async (id) => {
              console.log("onEditAction called with id:", id);
              const result = await onEditAction(tutorId, id);
              console.log("onEditAction result:", result);
              if (result.success) {
                router.push(
                  `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/assignment/${id}`
                );
              }
              return result;
            }}
            onReorderAction={async (updateData) => {
              console.log(
                "onReorderAction called with updateData:",
                updateData
              );
              setIsUpdating(true);
              const result = await onReorderAction(tutorId, updateData);
              console.log("onReorderAction result:", result);
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
