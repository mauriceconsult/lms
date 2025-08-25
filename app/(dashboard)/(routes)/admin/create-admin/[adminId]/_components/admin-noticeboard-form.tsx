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
import { Noticeboard, Admin } from "@prisma/client";
import {
  createNoticeboard,
  onEditAction,
} from "../../../../admin/create-admin/[adminId]/noticeboard/[noticeboardId]/actions";
import { AdminNoticeboardList } from "./admin-noticeboard-list";

interface CreateNoticeboardResponse {
  success: boolean;
  message: string;
  data?: Noticeboard;
}

interface AdminNoticeboardFormProps {
  initialData: Admin & { noticeboards: Noticeboard[] };
  adminId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const AdminNoticeboardForm = ({
  initialData,
  adminId,
}: AdminNoticeboardFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  console.log(
    "AdminNoticeboardForm initialData.noticeboards:",
    initialData.noticeboards
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response: CreateNoticeboardResponse = await createNoticeboard(
        adminId,
        values
      );
      console.log("createNoticeboard result:", response);
      if (response.success) {
        toast.success(response.message);
        setIsCreating(false);
        reset({ title: "" });
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Create noticeboard error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Admin noticeboard
        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant="ghost"
          disabled={isSubmitting}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a notice
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
                      placeholder="e.g., 'New Courses available'"
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
            !initialData.noticeboards.length && "text-slate-500 italic"
          )}
        >
          {!initialData.noticeboards.length &&
            "Admin notices are ideal for instant messaging across the Admin. Admin users' comments on your notices can facilitate interaction."}
          <AdminNoticeboardList
            onEditAction={async (id) => {
              const result = await onEditAction(adminId, id);
              console.log("onEditAction result:", result);
              if (result.success) {
                router.push(`/admin/create-admin/${adminId}/noticeboard/${id}`);
              }
              return result;
            }}
            items={initialData.noticeboards || []}
          />
        </div>
      )}
    </div>
  );
};
