"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NoticeboardWithComments, Comment } from "@/lib/prisma";

const commentSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }),
});

export default function NoticeboardClient({
  facultyId,
  noticeboardId,
  noticeboard,
}: {
  facultyId: string;
  noticeboardId: string;
  noticeboard: NoticeboardWithComments;
}) {
  const { userId, isLoaded } = useAuth();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (isLoaded && !userId) {
      window.location.href = "/";
    }
  }, [userId, isLoaded]);

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    try {
      await axios.post(`/api/faculties/${facultyId}/noticeboards/${noticeboardId}/comments`, {
        content: values.content,
        userId,
      });
      toast.success("Comment added!");
      form.reset();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        <Link href={`/faculties/${facultyId}/noticeboards`} className="text-blue-600 hover:underline">
          Faculty Noticeboards
        </Link>{" "}
        / {noticeboard.title}
      </div>
      <h1 className="text-2xl font-medium text-gray-900">{noticeboard.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        Published: {format(new Date(noticeboard.createdAt), "PPP")}
      </p>
      {noticeboard.description && (
        <div
          className="mt-4 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: noticeboard.description }}
        />
      )}
      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-900">Comments</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add a Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Your comment here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting} className="mt-2">
              Post Comment
            </Button>
          </form>
        </Form>
        <div className="mt-4 space-y-4">
          {noticeboard.comments.length ? (
            noticeboard.comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <p className="text-sm text-gray-600">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {comment.userId} on {format(new Date(comment.createdAt), "PPP")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
