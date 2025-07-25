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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Coursework, Faculty } from "@prisma/client";
import { FacultyCourseworkList } from "./faculty-coursework-list";

interface FacultyCourseworkFormProps {
  initialData: Faculty & { courseworks: Coursework[] };
  facultyId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const FacultyCourseworkForm = ({
  initialData,
  facultyId,
}: FacultyCourseworkFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });
  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/faculties/${facultyId}/courseworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Coursework created successfully");
        toggleCreating();
        reset({ title: "", description: "" });
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create coursework");
      }
    } catch (error) {
      console.error("Create coursework error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  const onEditAction = async (id: string) => {
    try {
      router.push(`/faculty/create-faculty/${facultyId}/coursework/${id}`);
      return {
        success: true,
        message: `Navigating to edit coursework ${id}`,
      };
    } catch (error) {
      console.error("Edit coursework error:", error);
      return {
        success: false,
        message: "Failed to initiate edit",
      };
    }
  };

  const onReorderAction = async (
    updateData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        `/api/faculties/${facultyId}/courseworks/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ list: updateData }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Courseworks reordered successfully");
        return {
          success: true,
          message: result.message || "Courseworks reordered successfully",
        };
      } else {
        toast.error(result.message || "Failed to reorder courseworks");
        return {
          success: false,
          message: result.message || "Failed to reorder courseworks",
        };
      }
    } catch (error) {
      console.error("Reorder coursework error:", error);
      toast.error("Failed to reorder courseworks");
      return { success: false, message: "Failed to reorder courseworks" };
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div
          className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Coursework*
        <Button
          onClick={toggleCreating}
          variant="ghost"
          disabled={isSubmitting}
          aria-label={
            isCreating ? "Cancel adding coursework" : "Add a new coursework"
          }
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Coursework
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Principles of Fashion Design'"
                      {...field}
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
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Introduction to design principles'"
                      {...field}
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
                "Create"
              )}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.courseworks.length && "text-slate-500 italic"
          )}
        >
          {!initialData.courseworks.length && "Add Coursework(s) here. At least one Coursework is required for every Faculty."}
          <FacultyCourseworkList
            onEditAction={onEditAction}
            onReorderAction={onReorderAction}
            items={initialData.courseworks || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Courseworks
        </p>
      )}
    </div>
  );
};
