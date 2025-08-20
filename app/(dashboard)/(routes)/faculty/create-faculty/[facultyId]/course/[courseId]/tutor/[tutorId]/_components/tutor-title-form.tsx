// components/TutorTitleForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

interface TutorTitleFormProps {
  initialData: {  
    title: string;
  };
  facultyId: string;
  courseId: string;
  tutorId: string;
}

export const TutorTitleForm = ({
  initialData,
  facultyId,
  courseId,
  tutorId,
}: TutorTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `/api/faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update title");
      }
      toast.success("Tutor title updated");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h3>Tutor Title</h3>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">{initialData.title || "No title"}</p>
      ) : (
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
                      placeholder="e.g. 'Introduction to Algebra'"
                      {...field}
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
};
