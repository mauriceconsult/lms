import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  tutorId: z.string().min(1, "Tutor is required"),
  courseworkId: z.string().min(1, "Coursework is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default async function TutorAssignmentCreatePage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { facultyId, courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${facultyId}/courses/${courseId}/tutor-assignments/create`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${facultyId}/courses/${courseId}`);
  }

  const tutors = await db.tutor.findMany({
    where: { courseId },
    select: { id: true, title: true },
  });

  const courseworks = await db.coursework.findMany({
    where: { courseId },
    select: { id: true, title: true },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Pair Tutor with Assignment
      </h1>
      <FormWrapper
        tutors={tutors}
        courseworks={courseworks}
        facultyId={facultyId}
        courseId={courseId}
      />
    </div>
  );
}

function FormWrapper({
  tutors,
  courseworks,
  facultyId,
  courseId,
}: {
  tutors: { id: string; title: string | null }[];
  courseworks: { id: string; title: string | null }[];
  facultyId: string;
  courseId: string;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutorId: "",
      courseworkId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post(
        `/api/faculties/${facultyId}/courses/${courseId}/tutor-assignments`,
        values
      );
      toast.success("Tutor paired with assignment!");
      window.location.href = `/faculties/${facultyId}/courses/${courseId}?role=admin`;
    } catch (error: unknown) {
      toast.error("Failed to pair tutor with assignment");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tutorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tutor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tutors.map((tutor) => (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      {tutor.title || "Untitled Tutor"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseworkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseworks.map((coursework) => (
                    <SelectItem key={coursework.id} value={coursework.id}>
                      {coursework.title || "Untitled Coursework"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Pairing
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href = `/faculties/${facultyId}/courses/${courseId}?role=admin`)
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
