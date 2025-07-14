// components/PayrollFacultyPayrollForm.tsx
"use client";

import * as z from "zod";
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
import { FacultyPayroll, Payroll } from "@prisma/client";
import { createFacultyPayroll, onEditAction, onReorderAction } from "../actions";
import FacultyPayrollList from "./payroll-facultyPayroll-list";

interface PayrollFacultyPayrollFormProps {
  initialData: Payroll & { facultyPayrolls: FacultyPayroll[] };
  payrollId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const PayrollFacultyPayrollForm = ({
  initialData,
  payrollId,
}: PayrollFacultyPayrollFormProps) => {
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
    const { success, message } = await createFacultyPayroll(payrollId, values);
    if (success) {
      toast.success(message);
      toggleCreating();
      router.refresh();
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Faculty Payroll*
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Payroll
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
                      placeholder="Payroll name, e.g., 'Education Faculty Payroll'"
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
            !initialData.facultyPayrolls.length && "text-slate-500 italic"
          )}
        >
          {!initialData.facultyPayrolls.length &&
            "Add your Faculty Payrolls here."}
          <FacultyPayrollList
            onEditAction={async (id) => {
              const result = await onEditAction(payrollId, id);
              if (result.success) {
                router.push(
                  `/payroll/create-payroll/${payrollId}/facultyPayroll/${id}`
                );
              }
              return result;
            }}
            onReorderAction={async (updateData) => {
              setIsUpdating(true);
              const result = await onReorderAction(payrollId, updateData);
              setIsUpdating(false);
              router.refresh();
              return result;
            }}
            items={initialData.facultyPayrolls.map((item) => ({
              ...item,
              payroll: item.payrollId
                ? { id: item.payrollId, amount: 0 }
                : null, // Adjust based on schema
            }))}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the Faculty Payrolls
        </p>
      )}
    </div>
  );
};
