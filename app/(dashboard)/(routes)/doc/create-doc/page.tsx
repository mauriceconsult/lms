"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreateDocs = () => {
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
      const response = await axios.post("/api/create-docs", values);
      router.push(`/doc/create-doc/${response.data.id}`);
      toast.success("Doc created!");
    } catch {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your doc</h1>
        <p className="text-sm text-slate-600">
          Please give a name your doc. Don&apos;t worry, you can change the name later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doc name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Getting Started'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you explain in this doc?

                    {/**TODO: link to create doc tutorial page */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-12">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateDocs;
