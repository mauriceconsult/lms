"use client";

import * as z from "zod";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import dynamic from "next/dynamic";
import { Preview } from "@/components/preview";

// Dynamically import Editor
const DynamicEditor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  }
);

interface CourseDescriptionFormProps {
  initialData: Course;
  facultyId: string;
  courseId: string;
}

const formSchema = z.object({
  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .optional(),
});

export const CourseDescriptionForm = ({
  initialData,
  facultyId,
  courseId,
}: CourseDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    console.log(
      `[${new Date().toISOString()} CourseDescriptionForm] initialData.description:`,
      initialData.description
    );
  }, [initialData.description]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/descriptions`,
        values
      );
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Failed to update course");
      }
      toast.success("Course description updated");
      toggleEdit();
      form.reset({ description: values.description || "" });
      router.refresh();
    } catch (error) {
      console.error(
        `[${new Date().toISOString()} CourseDescriptionForm] Update course error:`,
        error
      );
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (axiosError.response?.status === 401) {
        toast.error("Unauthorized: Please log in again");
      } else if (axiosError.response?.status === 404) {
        toast.error("Course not found");
      } else {
        toast.error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Something went wrong"
        );
      }
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {isSubmitting && (
        <div
          className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                console.log(
                  `[${new Date().toISOString()} CourseDescriptionForm] field object:`,
                  field
                );
                console.log(
                  `[${new Date().toISOString()} CourseDescriptionForm] field.onChange type:`,
                  typeof field.onChange
                );
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      {typeof field.onChange === "function" ? (
                        <DynamicEditor
                          value={field.value}
                          onChangeAction={field.onChange}
                          onErrorAction={(error) =>
                            form.setError("description", { message: error })
                          }
                          maxFileSize={2 * 1024 * 1024}
                          allowedFileTypes={["image/jpeg", "image/png"]}
                          debounceDelay={500}
                          maxLength={5000}
                          toolbarConfig={{
                            headers: true,
                            font: false,
                            size: false,
                            formatting: true,
                            colors: false,
                            lists: true,
                            link: true,
                            image: true,
                            align: true,
                            clean: true,
                            blockquote: true,
                            codeBlock: true,
                          }}
                        />
                      ) : (
                        <div>Loading form field...</div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                aria-label="Save course description"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
