// app/(eduplat)/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@clerk/nextjs/server";
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
import toast from "react-hot-toast";
import Link from "next/link";

const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export default function AboutPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    // Fetch initial content
    axios.get("/api/about").then((response) => {
      setContent(response.data.content);
      form.setValue("content", response.data.content);
    });

    // Check if user is admin
    auth().then(({ userId }) => {
      if (userId) {
        setIsAdmin(true); // Replace with actual admin check
      }
    });
  }, [form]);

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">About eduPlat</h1>
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
    </div>
  );
}
