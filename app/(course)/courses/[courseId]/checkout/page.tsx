import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-4">
            You must be signed in to purchase a course.
          </p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const course = await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    select: {
      id: true,
      title: true,
      amount: true,
    },
  });

  if (!course) {
    notFound();
  }

  if (!course.amount) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Invalid Course
          </h1>
          <p className="text-gray-600 mb-4">
            This course is free and does not require payment.
          </p>
          <Link href={`/courses/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleCheckout(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/courses/${courseId}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[${new Date().toISOString()} Checkout] API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    if (result.success && result.data.paymentUrl) {
      redirect(result.data.paymentUrl);
    }
    throw new Error("Payment initiation failed");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Checkout: {course.title}
        </h1>
        <p className="text-gray-600 mb-4">Price: ${course.amount}</p>
        <form action={handleCheckout} className="space-y-4">
          <input type="hidden" name="userId" value={userId} />
          <Button type="submit" className="bg-blue-600 text-white">
            Pay with MoMo
          </Button>
          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="ml-2">
              Cancel
            </Button>
          </Link>
        </form>
        <p className="text-gray-600 mt-4">
          After payment, you’ll be enrolled and redirected to the course
          content.
        </p>
        <Link
          href="https://x.com/instaskul"
          className="text-blue-600 hover:underline mt-4 block"
        >
          Share this course on X (#InstaSkulStories)
        </Link>
      </div>
    </div>
  );
}
