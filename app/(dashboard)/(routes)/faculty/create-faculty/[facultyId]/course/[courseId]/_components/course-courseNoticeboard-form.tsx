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
import { CourseNoticeboard, Course } from "@prisma/client";
import { CourseCourseNoticeboardList } from "./course-courseNoticeboard-list";

interface CourseCourseNoticeboardFormProps {
  initialData: Course & { courseNoticeboards: CourseNoticeboard[] };
  courseId: string;
  facultyId: string; // Add facultyId
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
});

export const CourseCourseNoticeboardForm = ({
  initialData,
  courseId,
  facultyId,
}: CourseCourseNoticeboardFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });
  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/courseNoticeboards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "CourseNoticeboard created successfully");
        toggleCreating();
        reset({ name: "", email: "" });
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create courseNoticeboard");
      }
    } catch (error) {
      console.error("Create courseNoticeboard error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  const onEditAction = async (id: string) => {
    try {
      router.push(`/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/${id}`);
      return {
        success: true,
        message: `Navigating to edit courseNoticeboard ${id}`,
      };
    } catch (error) {
      console.error("Edit courseNoticeboard error:", error);
      return {
        success: false,
        message: "Failed to initiate edit",
      };
    }
  };

  const onReorderAction = async (
    updateData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/courses/${courseId}/courseNoticeboards/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: updateData }),
      });
      let result;
      try {
        result = await response.json();
      } catch (error) {
        console.error("Reorder courseNoticeboard error:", error);
        throw new Error("Invalid JSON response");
      }
      if (response.ok) {
        toast.success(result.message || "CourseNoticeboards reordered successfully");
        return {
          success: true,
          message: result.message || "CourseNoticeboards reordered successfully",
        };
      } else {
        toast.error(result.message || "Failed to reorder courseNoticeboards");
        return {
          success: false,
          message: result.message || "Failed to reorder courseNoticeboards",
        };
      }
    } catch (error) {
      console.error("Reorder courseNoticeboard error:", error);
      toast.error("Failed to reorder courseNoticeboards");
      return { success: false, message: "Failed to reorder courseNoticeboards" };
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
        CourseNoticeboards*
        <Button
          onClick={toggleCreating}
          variant="ghost"
          disabled={isSubmitting}
          aria-label={isCreating ? "Cancel adding courseNoticeboard" : "Add a new courseNoticeboard"}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a CourseNoticeboard
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'John Doe'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'john.doe@example.com'"
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
            !initialData.courseNoticeboards.length && "text-slate-500 italic"
          )}
        >
          {!initialData.courseNoticeboards.length &&
            "Add Course Notice(s) here. At least one CourseNoticeboard is required for every Course."}
          <CourseCourseNoticeboardList
            onEditAction={onEditAction}
            onReorderAction={onReorderAction}
            items={initialData.courseNoticeboards || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Course Notices
        </p>
      )}
    </div>
  );
};
