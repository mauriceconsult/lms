"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  objective: z.string().optional(),
});

interface AssignmentObjectiveFormProps {
  initialData: { objective: string | null };
  facultyId: string;
  courseId: string;
  assignmentId: string;
}

export function AssignmentObjectiveForm({
  initialData,
  facultyId,
  courseId,
  assignmentId,
}: AssignmentObjectiveFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: initialData.objective ?? undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `/api/faculty/${facultyId}/course/${courseId}/assignment/assignments/${assignmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update objective:", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Assignment objective
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">{initialData.objective || "No objective"}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'Understand the basics of...'"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}