"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isPublished: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface CourseworkFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

export function CourseworkForm({ onSubmit }: CourseworkFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", isPublished: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <input
        {...form.register("title")}
        placeholder="Enter coursework title"
        className="w-full p-2 border rounded"
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
