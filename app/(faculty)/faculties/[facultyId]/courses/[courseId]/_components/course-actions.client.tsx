"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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

  useEffect(() => {
    console.log(
      "CourseActions: initialData =",
      JSON.stringify(initialData, null, 2)
    );
    console.log("CourseActions: form.isPublished =", isPublished);
    console.log(
      "CourseActions: form.values =",
      JSON.stringify(form.getValues(), null, 2)
    );
    if (initialData.isPublished !== form.getValues("isPublished")) {
      console.log("CourseActions: Resetting form due to isPublished mismatch");
      form.reset({ ...initialData, isPublished: initialData.isPublished });
      setForceRender((prev) => prev + 1);
    }
  }, [initialData, form]);

  const onSubmit = async (values: FormValues) => {
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
    } catch (error: any) {
      console.error(
        "CourseActions: Submit error =",
        JSON.stringify(error.response?.data || error.message, null, 2)
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
              disabled={!isValid || isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              Publish
            </PublishButton>
          ) : (
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save
            </Button>
          )}
        </form>
      </Form>
    </ErrorBoundary>
  );
}
