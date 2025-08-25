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
import {
  createCourse,
  onEditAction,
} from "../../../../admin/create-admin/[adminId]/course/[courseId]/actions";
import { AdminCourseList } from "./admin-course-list";

// Define the expected return type for createCourse
interface CreateCourseResponse {
  success: boolean;
  message: string;
  data?: Course; // Optional course data
}

interface AdminCourseFormProps {
  initialData: Admin & { courses: Course[] };
  adminId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const AdminCourseForm = ({
  initialData,
  adminId,
}: AdminCourseFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
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

  console.log("AdminCourseForm initialData.courses:", initialData.courses);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response: CreateCourseResponse = await createCourse(
        adminId,
        values
      );
      console.log("createCourse result:", response);
      if (response.success) {
        toast.success(response.message);
        setIsCreating(false);
        reset({ title: "" });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for server action
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Create course error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Admin course
        <Button
          onClick={() => setIsCreating(!isCreating)}
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
                      placeholder="e.g., 'Fashion & Design'"
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
            "You need at least one published Course to publish this Admin."}
          <AdminCourseList
            onEditAction={async (id) => {
              const result = await onEditAction(adminId, id);
              console.log("onEditAction result:", result);
              if (result.success) {
                router.push(`/admin/create-admin/${adminId}/course/${id}`);
              }
              return result;
            }}
            items={initialData.courses || []}
          />
        </div>
      )}
    </div>
  );
};
