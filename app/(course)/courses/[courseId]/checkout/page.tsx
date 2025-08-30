"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900">
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push(`/courses/${params.courseId}/pay`)}
            className="w-full bg-slate-800 text-white hover:bg-slate-900"
          >
            Pay with MTN MoMo
          </Button>
          <p className="text-sm text-slate-500 mt-2 text-center">
            Bank wallet option coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
