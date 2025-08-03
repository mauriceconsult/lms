"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/lib/uploadthing";
import Link from "next/link";
import toast from "react-hot-toast";
import React from "react";

const formSchema = z.object({
  title: z.string().min(1, { message: "Coursework title is required" }),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        key: z.string(),
      })
    )
    .optional()
    .default([]),
});

export default function CreateCourseworkPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { facultyId } = React.use(params);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: false,
      attachments: [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (isLoaded && !userId) {
      void router.push("/");
    }
  }, [userId, isLoaded, router]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!userId) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        userId,
        description: values.description?.trim() || null,
      };

      await axios.post(`/api/faculties/${facultyId}/courseworks`, payload);
      toast.success("Coursework created!");
      void router.push(`/faculties/${facultyId}`);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Create Coursework</h1>
        <p className="text-sm text-slate-600">
          Give your coursework a title and optional description. You can also add
          attachments and choose to publish it immediately. Don&apos;t worry, you
          can edit these details later.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coursework Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Introduction to Design'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is the title of this coursework?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g., 'Learn the basics of design principles'"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the coursework.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments (Optional)</FormLabel>
                  <FormControl>
                    <UploadButton<OurFileRouter, "courseworkAttachment">
                      endpoint="courseworkAttachment"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          form.setValue(
                            "attachments",
                            res.map((file) => ({
                              name: file.name,
                              url: file.url,
                              key: file.key,
                            }))
                          );
                          toast.success("Upload completed!");
                          setIsUploading(false);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(error.message || "Upload failed");
                        setIsUploading(false);
                      }}
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      onUploadProgress={() => {
                        setIsUploading(true);
                      }}
                      className="ut-button:bg-green-600 ut-button:text-white ut-button:hover:bg-green-700 ut-button:disabled:bg-gray-300 ut-button:disabled:cursor-not-allowed ut-button:rounded-lg ut-button:px-4 ut-button:py-2"
                      disabled={isSubmitting || !userId || isUploading}
                    />
                  </FormControl>
                  {field.value.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {field.value.map((attachment, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center">
                          {attachment.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              form.setValue(
                                "attachments",
                                field.value.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <FormDescription>
                    Upload any relevant files for the coursework (e.g., PDFs, images).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Publish Immediately
                    </FormLabel>
                    <FormDescription>
                      Make the coursework visible to students immediately.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-12">
              <Link href={`/faculties/${facultyId}`}>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting || isUploading}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}