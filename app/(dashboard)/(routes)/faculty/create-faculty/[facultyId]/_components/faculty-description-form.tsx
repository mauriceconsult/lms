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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Faculty } from "@prisma/client";
import dynamic from "next/dynamic";
import { updateFaculty } from "../actions";

// Define EditorProps to match Editor.tsx
interface EditorProps {
  onChangeAction: (value: string) => void;
  value: string | undefined;
  onErrorAction?: (error: string) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  debounceDelay?: number;
  toolbarConfig?: {
    headers?: boolean;
    font?: boolean;
    size?: boolean;
    formatting?: boolean;
    colors?: boolean;
    lists?: boolean;
    link?: boolean;
    image?: boolean;
    align?: boolean;
    clean?: boolean;
    blockquote?: boolean;
    codeBlock?: boolean;
  };
  maxLength?: number;
  onCharCountChangeAction?: (count: number) => void;
}

// Dynamically import Editor (let TypeScript infer the type)
const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  }
);

interface FacultyDescriptionFormProps {
  initialData: Faculty;
  facultyId: string;
}

const formSchema = z.object({
  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .optional(),
});

export const FacultyDescriptionForm = ({
  initialData,
  facultyId,
}: FacultyDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description || "" },
  });
  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { success, message } = await updateFaculty(facultyId, values);
      if (success) {
        toast.success(message);
        toggleEditing();
        reset({ description: values.description || "" });
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Update faculty error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isSubmitting && (
        <div
          className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Faculty Description
        <Button onClick={toggleEditing} variant="ghost" disabled={isSubmitting}>
          {isEditing ? <>Cancel</> : <>Edit Description</>}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChangeAction={field.onChange}
                      onErrorAction={(error) =>
                        form.setError("description", { message: error })
                      }
                      maxFileSize={2 * 1024 * 1024}
                      allowedFileTypes={["image/jpeg", "image/png"]}
                      debounceDelay={500}
                      maxLength={5000}
                      toolbarConfig={{
                        headers: true,
                        font: false, // Not supported by Tiptap StarterKit
                        size: false, // Not supported by Tiptap StarterKit
                        formatting: true,
                        colors: false, // Requires additional extension
                        lists: true,
                        link: true,
                        image: true,
                        align: true,
                        clean: true,
                        blockquote: true,
                        codeBlock: true,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      )}
      {!isEditing && (
        <div className="text-sm mt-2">
          {initialData.description ? (
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl"
              dangerouslySetInnerHTML={{ __html: initialData.description }}
            />
          ) : (
            <p className="text-slate-500 italic">No description added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
