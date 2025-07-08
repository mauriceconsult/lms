"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course, Tuition } from "@prisma/client";
import { CourseTuitionList } from "./course-tuition-list";


interface CourseTuitionFormProps {
  initialData: Course & { tuitions: Tuition[] }
  facultyId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const CourseTuitionForm = ({
  initialData,
  facultyId,
  courseId,
}: CourseTuitionFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });  
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/create-faculties/${facultyId}/courses/${courseId}/tuitions`, values);
      toast.success("Course Tuition created.");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/create-faculties/${facultyId}/courses/${courseId}/tuitions/reorder`, {
        list: updateData,
      });
      toast.success("Course Tuitions reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  const onEdit = (id: string) => {
    router.push(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tuition/${id}`
    );
  };
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">

      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Tuition
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Tuition
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
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Design Principles tuition'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.tuitions.length && "text-slate-500 italic"
          )}
        >
          {!initialData.tuitions.length && "No Tuitions yet"}
          <CourseTuitionList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.tuitions || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Tuitions
        </p>
      )}
    </div>
  );
};
