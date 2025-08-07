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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface PartyIdFormProps {
  initialData: {
    partyId: string;
  };
  courseId: string;
  tutorId: string;
  facultyId: string;
}

const formSchema = z.object({
  partyId: z
    .string()
    .min(12, "MSISDN must be at least 12 characters long")
    .max(15, "MSISDN cannot exceed 15 characters")
    .regex(/^\+?[0-9]+$/, "MSISDN must be a valid phone number"),
});

export const PartyIdForm = ({
  initialData,
  courseId,
  // tutorId,
  facultyId,
}: PartyIdFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const course = await axios.get(`/api/faculties/${facultyId}/courses/${courseId}`);
      const amount = parseFloat(course.data.amount);
      await axios.post(`/api/faculties/${facultyId}/courses/${courseId}/checkout`, {
        msisdn: values.partyId,
        amount,
      });
      toast.success("Payment initiated successfully.");
      toggleEdit();
      router.push(`/faculties/${facultyId}/courses/${courseId}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Phone number*
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit phone number
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter your MTN phone number for tuition payment.
      </p>
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="partyId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g., +256701234567"
                      {...field}
                      disabled={isSubmitting}
                      className="w-full"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Pay Now
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
