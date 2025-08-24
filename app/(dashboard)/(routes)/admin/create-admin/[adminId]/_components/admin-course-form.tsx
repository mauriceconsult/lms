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
import { Course, Admin } from "@prisma/client";
import { AdminCourseList } from "./admin-course-list";
import { createCourse, onEditAction, onReorderAction } from "../actions";

interface AdminCourseFormProps {
  initialData: Admin & { courses: Course[] };
  adminId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Course name is required"),
});

export const AdminCourseForm = ({
  initialData,
  adminId,
}: AdminCourseFormProps) => {
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
      const { success, message } = await createCourse(adminId, values);
      if (success) {
        toast.success(message);
        toggleCreating();
        reset({ title: "" });
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Create course error:", error);
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
        Course*
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
              Add a Course
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
                      placeholder="e.g., 'Principals of Fashion Design'"
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
            !initialData.courses.length && "text-slate-500 italic"
          )}
        >
          {!initialData.courses.length &&
            "You can add as many Courses as you like but at least one published Course is required for a Admin."}
          <AdminCourseList
            onEditAction={async (id) => {
              const result = await onEditAction(adminId, id);
              if (result.success) {
                router.push(
                  `/admin/create-admin/${adminId}/course/${id}`
                );
              }
              return result;
            }}
            onReorderAction={async (updateData) => {
              setIsUpdating(true);
              const result = await onReorderAction(adminId, updateData);
              setIsUpdating(false);
              router.refresh();
              return result;
            }}
            items={initialData.courses || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Courses
        </p>
      )}
    </div>
  );
};
