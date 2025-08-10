"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios"; // Import AxiosError
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PublishButton } from "./publish-button";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number (e.g., 100.00)")
    .optional()
    .nullable(),
  isPublished: z.boolean().default(false),
  publishDate: z
    .date()
    .optional()
    .nullable()
    .refine((date) => !date || date >= new Date(), {
      message: "Publish date must be in the future",
    }),
  canPublish: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseActionsProps {
  courseId: string;
  facultyId: string;
  initialData: {
    title: string;
    description: string | null;
    amount: string | null;
    isPublished: boolean;
    publishDate: Date | null;
    canPublish: boolean;
  };
}

function ErrorBoundary({
  children,
  forceRender,
}: {
  children: React.ReactNode;
  forceRender: number;
}) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [forceRender]);
  if (hasError) return <div>Error loading form</div>;
  return children;
}

export function CourseActions({
  courseId,
  facultyId,
  initialData,
}: CourseActionsProps) {
  const [forceRender, setForceRender] = useState(0);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const isPublished = form.watch("isPublished") ?? initialData.isPublished;
  const canPublish = form.watch("canPublish") ?? initialData.canPublish;

  useEffect(() => {
    console.log(
      "CourseActions: initialData =",
      JSON.stringify(initialData, null, 2)
    );
    console.log("CourseActions: form.isPublished =", isPublished);
    console.log("CourseActions: form.canPublish =", canPublish);
    console.log(
      "CourseActions: form.values =",
      JSON.stringify(form.getValues(), null, 2)
    );
    if (
      initialData.isPublished !== form.getValues("isPublished") ||
      initialData.canPublish !== form.getValues("canPublish")
    ) {
      console.log(
        "CourseActions: Resetting form due to isPublished or canPublish mismatch"
      );
      form.reset({
        ...initialData,
        isPublished: initialData.isPublished,
        canPublish: initialData.canPublish,
      });
      setForceRender((prev) => prev + 1);
    }
  }, [initialData, form, isPublished, canPublish]); // Added dependencies

  const onSubmit = async (values: FormValues) => {
    if (values.isPublished && !values.canPublish) {
      toast.error(
        "Cannot publish: Ensure at least one tutor and assignment are added, and all tutors are paired with assignments."
      );
      return;
    }
    try {
      console.log(
        "CourseActions: Submitting values =",
        JSON.stringify(values, null, 2)
      );
      const response = await axios.patch(
        `/api/faculties/${facultyId}/courses/${courseId}`,
        {
          ...values,
          description: values.description?.trim() || null,
          publishDate: values.isPublished
            ? null
            : values.publishDate?.toISOString(),
        }
      );
      console.log(
        "CourseActions: PATCH response =",
        JSON.stringify(response.data, null, 2)
      );
      toast.success(values.isPublished ? "Course published!" : "Course saved!");
      if (values.isPublished !== isPublished) {
        setForceRender((prev) => prev + 1);
      }
    } catch (error: AxiosError | unknown) {
      // Typed as AxiosError | unknown
      console.error(
        "CourseActions: Submit error =",
        JSON.stringify(
          (error as AxiosError).response?.data || (error as Error).message,
          null,
          2
        )
      );
      toast.error("Something went wrong!");
    }
  };

  return (
    <ErrorBoundary forceRender={forceRender}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-x-2"
        >
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input type="hidden" {...field} value={String(field.value)} />
                </FormControl>
              </FormItem>
            )}
          />
          {isPublished ? (
            <PublishButton
              disabled={!isValid || isSubmitting || !canPublish}
              onClick={form.handleSubmit(onSubmit)}
            >
              Publish
            </PublishButton>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || !canPublish}
            >
              Save
            </Button>
          )}
        </form>
      </Form>
    </ErrorBoundary>
  );
}
