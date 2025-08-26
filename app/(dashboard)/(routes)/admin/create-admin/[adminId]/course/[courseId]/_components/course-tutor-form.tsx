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
import { Tutor, Course } from "@prisma/client";
import { CourseTutorList } from "./course-tutor-list";
import { createTutor, onEditAction } from "../tutorial/[tutorialId]/actions";

interface CreateTutorResponse {
  success: boolean;
  message: string;
  data?: Tutor;
}

interface CourseTutorFormProps {
  initialData: Course & { tutors: Tutor[] };
  courseId: string;
  adminId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const CourseTutorForm = ({
  initialData,
  courseId,
  adminId,
}: CourseTutorFormProps) => {
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

  console.log("CourseTutorForm initialData.tutors:", initialData.tutors);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response: CreateTutorResponse = await createTutor(courseId, values);
      console.log("createTutor result:", response);
      if (response.success) {
        toast.success(response.message);
        setIsCreating(false);
        reset({ title: "" });
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Create tutor error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Tutorials
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
              Add a Tutorial
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
                      placeholder="e.g., 'Intro to Fashion Design'"
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
            !initialData.tutors.length && "text-slate-500 italic"
          )}
        >
          {!initialData.tutors.length &&
            "You need at least one published Tutorial to complete this Course."}
          <CourseTutorList
            onEditAction={async (id) => {
              if (!id) {
                console.error("Invalid tutor ID passed to onEditAction:", id);
                return { success: false, message: "Invalid tutor ID" };
              }
              console.log("Navigating to tutor ID:", id);
              const result = await onEditAction(courseId, id);
              console.log("onEditAction result:", result);
              if (result.success) {
                router.push(
                  `/admin/create-admin/${adminId}/course/${courseId}/tutorial/${id}`
                );
              }
              return result;
            }}
            items={initialData.tutors || []}
          />
        </div>
      )}
    </div>
  );
};
