'use client';

import * as z from 'zod';
import axios, { type AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Assignment } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';

interface AssignmentTutorFormProps {
  initialData: Pick<Assignment, 'tutorId'>;
  facultyId: string;
  courseId: string;
  tutorId: string;
  assignmentId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  tutorId: z.string().min(1, {
    message: 'Tutor is required',
  }),
});

export const AssignmentTutorForm = ({
  initialData,
  facultyId,
  courseId,
  tutorId,
  assignmentId,
  options,
}: AssignmentTutorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutorId: initialData.tutorId || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}/assignments/${assignmentId}/tutors`,
        values
      );
      toast.success('Assignment Tutor updated.');
      toggleEdit();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tutor
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit tutor
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn('text-sm mt-2', !initialData.tutorId && 'text-slate-500 italic')}>
          {options.find((option) => option.value === initialData.tutorId)?.label || 'No tutor'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="tutorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutor</FormLabel>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
                      // disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};