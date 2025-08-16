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
import { Coursework, Course } from "@prisma/client";
import { CourseCourseworkList } from "./course-coursework-list";
import { createCoursework, onEditCourseworkAction, onReorderCourseworkAction } from "../coursework/[courseworkId]/actions";


interface CourseCourseworkFormProps {
  initialData: Course & { courseworks: Coursework[] };
  courseId: string;
  facultyId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const CourseCourseworkForm = ({
  initialData,
  courseId,
  facultyId,
}: CourseCourseworkFormProps) => {
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
      const { success } = await createCoursework(courseId, values);
      if (success) {
        toast.success("Coursework created successfully");
        toggleCreating();
        reset({ title: "" });
        router.refresh();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Create coursework error:", error);
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
        Course Coursework
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
              Add a Coursework
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
                      placeholder="e.g., 'Assignment 1: Project Proposal'"
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
            !initialData.courseworks.length && "text-slate-500 italic"
          )}
        >
          {!initialData.courseworks.length &&
            "At least one Coursework is required to evaluate the student's grasp of the key theme(s) of the Course. This could involve research, internship, or field reports or proposals."}
          <CourseCourseworkList
            onEditAction={async (id) => {
              const result = await onEditCourseworkAction(courseId, id);
              if (result.success) {
                router.push(
                  `/faculty/create-faculty/${facultyId}/course/${courseId}/coursework/${id}`
                );
              } else {
                toast.error(result.message);
              }
              return result;
            }}
            onReorderAction={async (
              updateData: { id: string; position: number }[]
            ) => {
              setIsUpdating(true);
              const courseworkIds = updateData.map((item) => item.id);
              const result = await onReorderCourseworkAction(
                courseId,
                courseworkIds
              );
              setIsUpdating(false);
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
              router.refresh();
              return result;
            }}
            items={initialData.courseworks || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Coursework
        </p>
      )}
    </div>
  );
};
