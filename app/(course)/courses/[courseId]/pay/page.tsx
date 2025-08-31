// app/(course)/courses/[courseId]/pay/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { processPayment } from "./actions";
import { useEffect, useState } from "react";
import { use } from "react";

// Form schema
const paymentSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  msisdn: z
    .string()
    .regex(
      /^\d{12}$/,
      "Phone number must be a 12-digit MSISDN (e.g., 2567XXXXXXXX)"
    ),
});

export default function TuitionPaymentPage({
  params: paramsPromise,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const params = use(paramsPromise); // Unwrap params with React.use()
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { username: "", msisdn: "256781234567" }, // Test MSISDN
  });
  const [amount, setAmount] = useState<string>(
    searchParams.get("amount") || ""
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch course amount from API
  useEffect(() => {
    async function fetchAmount() {
      try {
        const response = await fetch(`/api/courses/${params.courseId}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else if (data.amount && data.amount !== "0") {
          setAmount(data.amount);
        } else if (!searchParams.get("amount")) {
          setError("Course amount not available");
        }
      } catch (error) {
        console.log("[AMOUNT]", error);
        setError("Failed to load course amount");
      }
    }
    fetchAmount();
  }, [params.courseId, searchParams]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!amount || amount === "0") {
      form.setError("root", { message: "Course amount is required" });
      return;
    }
    try {
      await processPayment({ ...data, courseId: params.courseId, amount });
      router.push(`/courses/${params.courseId}?enrollment=success`);
    } catch (error) {
      console.log("[PAY_SUBMIT]", error);
      form.setError("root", {
        message: "Failed to process payment. Try again.",
      });
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900">
            Create your student account and pay with MTN MoMo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="bg-white text-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="msisdn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900">
                      Phone Number (MSISDN)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2567XXXXXXXX"
                        {...field}
                        className="bg-white text-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-slate-900">
                Amount: {amount || "Loading..."}
              </p>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-slate-800 text-white hover:bg-slate-900"
                  disabled={!amount || amount === "0"}
                >
                  Pay Now
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Access the Course instantly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
