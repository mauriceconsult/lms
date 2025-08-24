// app/(eduplat)/_components/about-content.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export function AboutContent({
  initialContent,
  isAdmin,
}: {
  initialContent: string;
  isAdmin: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: initialContent },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/about", values);
      setContent(values.content);
      setIsEditing(false);
      toast.success("About content updated!");
    } catch {
      toast.error("Failed to update content");
    }
  };

  return (
    <>
      {isEditing && isAdmin ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter About page content..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <div className="prose max-w-none">
            {content || (
              <>
                <p>
                  Welcome to eduPlat, an educational platform for managing
                  courses and academic units.
                </p>
                <h2>Setting Up Admin Accounts</h2>
                <p>
                  Admin accounts in eduPlat represent academic units, such as
                  faculties or departments (e.g., &quot;Fashion & Design Faculty&quot; or
                  &quot;School of Business&quot;). When naming your admin account, choose
                  a title that reflects the academic scope of the courses you’ll
                  manage. You can create and manage courses, track user
                  progress, and define your educational vision.
                </p>
                <p>
                  To get started, visit the{" "}
                  <Link
                    href="/create-admin"
                    className="text-blue-600 underline"
                  >
                    Create Admin
                  </Link>{" "}
                  page.
                </p>
              </>
            )}
          </div>
          {isAdmin && (
            <Button className="mt-4" onClick={() => setIsEditing(true)}>
              Edit Content
            </Button>
          )}
        </>
      )}
    </>
  );
}
