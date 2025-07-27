"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface CourseEnrollButtonProps {
  courseId: string;
  courseTitle: string;
  amount: string | null; // Fix: Allow null for Momo API compatibility
}

export const CourseEnrollButton = ({
  courseId,
  courseTitle,
  amount,
}: CourseEnrollButtonProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!userId) {
      router.push("/");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Checkout failed");
      }

      const { transactionId } = await response.json();
      alert(
        `Payment successful for ${courseTitle}! Transaction ID: ${transactionId}`
      );
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {amount ? (
        <>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : `Enroll for ${parseFloat(amount).toFixed(2)} EUR`}
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </>
      ) : (
        <p className="text-sm text-gray-600">
          Enrollment not available (no amount specified)
        </p>
      )}
    </div>
  );
};
