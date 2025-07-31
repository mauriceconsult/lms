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
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import { EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock authentication (replace with real auth logic)
const getCurrentStudentId = () => "mock-student-id"; // Replace with actual auth context

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z
    .string()
    .min(1, "Abstract is required")
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(1, "Description is required")
    .transform((val) => val.trim()),
});

interface StudentCourseworkFormProps {
  onSubmit: (
    data: z.infer<typeof formSchema> & {
      studentId: string;
      courseworkId: string;
    }
  ) => Promise<void>;
  disabled?: boolean;
}

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
  const params = useParams();
  const courseworkId = params?.courseworkId as string;
  const studentId = getCurrentStudentId();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false); // State for success message
  const [isError, setIsError] = useState(false); // State for error message

  // Abstract editor with basic features
  const abstractEditor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2] } })],
    content: form.getValues("abstract") || "",
    onUpdate: ({ editor }) => {
      form.setValue("abstract", editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Description editor with advanced features
  const descriptionEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: form.getValues("description") || "",
    onUpdate: ({ editor }) => {
      form.setValue("description", editor.getHTML());
    },
    immediatelyRender: false,
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting data:", { ...data, studentId, courseworkId }); // Log submission data
      const response = await onSubmit({
        ...data,
        studentId,
        courseworkId,
      });
      console.log("onSubmit response:", response); // Log the response to diagnose redirect
      console.log("Current URL before refresh:", window.location.href); // Log current URL
      form.reset(); // Clear form after success
      router.refresh(); // Revalidate and refresh the current page
      console.log("URL after refresh:", window.location.href); // Log URL after refresh
      setIsSuccess(true); // Show success message
      setIsError(false); // Clear error
    } catch (error) {
      console.error("Submission failed:", error); // Log error
      setIsError(true); // Show error message
      setIsSuccess(false); // Clear success
    }
  };

  const closeMessage = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {" "}
        {/* No action attribute */}
        <input type="hidden" name="studentId" value={studentId} />
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
          render={() => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <Toolbar editor={abstractEditor} />
              <FormControl>
                <div
                  className="border rounded p-2"
                  style={{ minHeight: "200px" }}
                >
                  {abstractEditor && (
                    <EditorContent
                      editor={abstractEditor}
                      disabled={disabled || isSubmitting}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Toolbar editor={descriptionEditor} />
              <FormControl>
                <div
                  className="border rounded p-2"
                  style={{ minHeight: "400px" }}
                >
                  {descriptionEditor && (
                    <EditorContent
                      editor={descriptionEditor}
                      disabled={disabled || isSubmitting}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled || isSubmitting}>
          Submit
        </Button>
      </form>
      {/* Custom success/error message */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Submission successful!</p>
            <Button onClick={closeMessage} className="mt-2">
              OK
            </Button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Submission failed. Please try again.</p>
            <Button onClick={closeMessage} className="mt-2">
              OK
            </Button>
          </div>
        </div>
      )}
      {/* Add custom styles for the editor */}
      <style>
        {`
          .custom-table td {
            border: 1px solid black;
            padding: 8px;
          }
          .custom-table {
            border-collapse: collapse;
            width: 100%;
          }
        `}
      </style>
    </Form>
  );
};

// Toolbar Component (defined outside for reusability)
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2 mb-2 flex gap-2">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "outline"}
      >
        B
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "outline"}
      >
        I
      </Button>
      <Button
        onClick={() => {
          editor
            .chain()
            .focus()
            .insertContent(
              `
            <table class="custom-table">
              <tbody>
                <tr><td></td><td></td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          `
            )
            .run();
        }}
        disabled={!editor}
      >
        Table
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "outline"}
      >
        •
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "outline"}
      >
        1.
      </Button>
      <Button
        onClick={() => {
          const suggestion =
            "Suggested text from AI: Enhance your content here.";
          editor.chain().focus().insertContent(suggestion).run();
        }}
      >
        Call AI
      </Button>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            alert(`Attached: ${file.name}`);
          }
        }}
        className="ml-2"
      />
    </div>
  );
};
