"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import toast from "react-hot-toast";
import React from "react";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableHeader, TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image } from "@tiptap/extension-image";
import debounce from "lodash.debounce";

const formSchema = z.object({
  title: z.string().min(1, { message: "Noticeboard title is required" }),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  publishDate: z.date().optional().nullable().refine(
    (date) => !date || date >= new Date(),
    { message: "Publish date must be in the future" }
  ),
});

export default function CreateNoticeboardPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { facultyId } = React.use(params);

  // Initialize form first
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: false,
      publishDate: null,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Debounced update function for Tiptap editor
  const debouncedUpdate = useCallback(
    (editor: Editor) => {
      const debouncedFn = debounce(() => {
        form.setValue("description", editor.getHTML(), { shouldValidate: true });
      }, 300);
      debouncedFn();
    },
    [form]
  );

  // Initialize editor after form
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      // TODO: Reintroduce AI extension here for future integration (e.g., with Grok API)
    ],
    content: "",
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor);
    },
    editable: true,
    immediatelyRender: false,
  });

  // Update editor's editable state based on isSubmitting
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isSubmitting);
    }
  }, [isSubmitting, editor]);

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
        publishDate: values.isPublished ? null : values.publishDate,
      };

      await axios.post(`/api/faculties/${facultyId}/noticeboards`, payload);
      toast.success("Noticeboard saved!");
      form.reset();
      editor?.commands.setContent("");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Create Noticeboard</h1>
        <p className="text-sm text-slate-600">
          Create a notice with a title and detailed description using the rich text editor. Choose to publish it immediately or schedule it for later to make it visible to students.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noticeboard Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Exam Schedule Update'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is the title of this notice?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <div className="border rounded-lg bg-white">
                      <div className="border-b p-2 flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editor && editor.can().toggleBold()) {
                              editor.chain().focus().toggleBold().run();
                            } else {
                              toast.error("Cannot apply bold formatting");
                            }
                          }}
                          disabled={!editor || !editor.can().toggleBold()}
                        >
                          B
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editor && editor.can().toggleItalic()) {
                              editor.chain().focus().toggleItalic().run();
                            } else {
                              toast.error("Cannot apply italic formatting");
                            }
                          }}
                          disabled={!editor || !editor.can().toggleItalic()}
                        >
                          I
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editor && editor.can().insertTable()) {
                              editor
                                .chain()
                                .focus()
                                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                .run();
                            } else {
                              toast.error("Cannot insert table");
                            }
                          }}
                          disabled={!editor || !editor.can().insertTable()}
                        >
                          Table
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const url = prompt("Enter image URL or upload an image:");
                            if (url && editor) {
                              editor.chain().focus().setImage({ src: url }).run();
                            }
                          }}
                          disabled={!editor}
                        >
                          Image
                        </Button>
                        {/* TODO: Reintroduce AI button here for future integration */}
                      </div>
                      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description with formatting, images, or tables.
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
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) form.setValue("publishDate", null);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Publish Immediately
                    </FormLabel>
                    <FormDescription>
                      Make the notice visible to students immediately.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Publish Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          disabled={isSubmitting || form.watch("isPublished")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Schedule a date for the notice to be published automatically.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-12">
              <Link href={`/faculties/${facultyId}`}>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
