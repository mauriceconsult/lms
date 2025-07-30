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
import { Button } from "@/components/ui/button";

// Define prop interface
interface StudentCourseworkFormProps {
  onSubmit: (data: {
    title: string;
    abstract: string;
    description: string;
  }) => Promise<void>;
  disabled?: boolean; // Added disabled prop
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  description: z.string().min(1, "Description is required"),
});

export const StudentCourseworkForm = ({
  onSubmit,
  disabled,
}: StudentCourseworkFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <input
                  {...field}
                  disabled={disabled || isSubmitting}
                  className="w-full p-2 border rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  disabled={disabled || isSubmitting}
                  className="w-full p-2 border rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  disabled={disabled || isSubmitting}
                  className="w-full p-2 border rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled || isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
