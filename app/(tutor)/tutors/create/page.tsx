"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isFree: z.boolean().default(false),
});

export default function CreateTutorPage({
  params,
}: {
  params: { facultyId: string; courseId: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      isFree: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/faculties/${params.facultyId}/courses/${params.courseId}/tutors`, values);
      toast.success("Tutor created successfully");
      router.push(`/faculties/${params.facultyId}/courses/${params.courseId}/tutors/${response.data.id}/video`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">Create New Tutor</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Introduction to Algebra" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Access</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Tutor"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
