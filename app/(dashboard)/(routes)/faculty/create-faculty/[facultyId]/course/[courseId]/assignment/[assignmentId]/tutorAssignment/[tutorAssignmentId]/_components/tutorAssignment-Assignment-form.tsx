"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from "@/components/ui/form"; 
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { TutorAssignment } from "@prisma/client";


interface TutorAssignmentAssignmentFormProps {
  initialData: TutorAssignment;
  facultyId: string;
  courseId: string;
  assignmentId: string;
  tutorAssignmentId: string;
  options: { label: string; value: string }[];
}
const formSchema = z.object({
  assignmentId: z.string().min(1),
});

export const TutorAssignmentAssignmentForm = ({
  initialData,
  facultyId,
  courseId,
  assignmentId,
  tutorAssignmentId,
  options,
}: TutorAssignmentAssignmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignmentId: initialData?.id || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/assignments/${assignmentId}/tutorAssignments/${tutorAssignmentId}/assignments`,
        values
      );
      toast.success("TutorAssignment updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };
  const selectedOption = options.find(
    (option) => option.value === initialData.assignmentId
  );

  return (
     <div className="mt-6 border bg-slate-100 rounded-md p-4">
       <div className="font-medium flex items-center justify-between">
         Assignment
         <Button onClick={toggleEdit} variant="ghost">
           {isEditing ? (
             <>Cancel</>
           ) : (
             <>
               <Pencil className="h-4 w-4 mr-2" />
               Edit Assignment
             </>
           )}
         </Button>
       </div>
       {!isEditing && (
         <p
           className={cn(
             "text-sm mt-2",
             !initialData.title && "text-slate-500 italic"
           )}
         >
           {selectedOption?.label || "No Assignment"}
         </p>
       )}
       {isEditing && (
         <Form {...form}>
           <form
             onSubmit={form.handleSubmit(onSubmit)}
             className="space-y-4 mt-4"
           >
             <FormField
               control={form.control}
               name="assignmentId"
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Combobox options={[...options]} {...field} />
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
 
 