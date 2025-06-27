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
import { StudentProject } from "@prisma/client";


interface StudentProjectCourseworkFormProps {
  initialData: StudentProject;
  facultyId: string;
  courseworkId: string;
  studentProjectId: string;
  options: { label: string; value: string }[];
}
const formSchema = z.object({
  courseworkId: z.string().min(1),
});

export const StudentProjectCourseworkForm = ({
  initialData,
  facultyId,
  courseworkId,
  studentProjectId,
  options,
}: StudentProjectCourseworkFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseworkId: initialData?.id || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/create-faculties/${facultyId}/courseworks/${courseworkId}/studentProject/${studentProjectId}`,
        values
      );
      toast.success("Topic updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };
  const selectedOption = options.find(
    (option) => option.value === initialData.courseworkId
  );

  return (
     <div className="mt-6 border bg-slate-100 rounded-md p-4">
       <div className="font-medium flex items-center justify-between">
         Coursework
         <Button onClick={toggleEdit} variant="ghost">
           {isEditing ? (
             <>Cancel</>
           ) : (
             <>
               <Pencil className="h-4 w-4 mr-2" />
               Edit Coursework
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
           {selectedOption?.label || "No Coursework"}
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
               name="courseworkId"
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
 
 