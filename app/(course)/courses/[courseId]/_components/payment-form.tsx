"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Use client-side auth hook
import { db } from "@/lib/db"; // Adjust path
import bcrypt from "bcryptjs";

interface PaymentFormProps {
  courseId: string;
  facultyId: string;
  amount: number;
}

export default function PaymentForm({
  courseId,
  facultyId,
  amount,
}: PaymentFormProps) {
  const router = useRouter();
  const { userId } = useAuth(); // Get userId from client-side auth
  const [msisdn, setMsisdn] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track form submission

  useEffect(() => {
    if (!userId) {
      setError("Unauthorized");
    }
  }, [userId]);

  const handlePaymentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msisdn || !username || !userId) {
      setError("Please enter MSISDN, username, and ensure you are logged in");
      return;
    }

    try {
      const hashedPartyId = await bcrypt.hash(msisdn, 12);

      // Update Student with username
      await db.student.upsert({
        where: { userId },
        create: { userId, username },
        update: { username },
      });

      // Update Tuition with partyId (mark as unpaid until checkout)
      await db.tuition.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, partyId: hashedPartyId, username },
        update: { partyId: hashedPartyId, username },
      });

      setIsFormSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleCheckout = async () => {
    if (!isFormSubmitted) {
      setError("Please submit the payment form first");
      return;
    }

    try {
      const response = await fetch(
        `/api/faculties/${facultyId}/courses/${courseId}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msisdn, amount }),
        }
      );

      if (!response.ok) {
        throw new Error("MoMo checkout failed");
      }

      // const data = await response.json();
      router.push(`/faculties/${facultyId}/courses/${courseId}/player`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div>
      <form id="payment-form" className="mt-4" onSubmit={handlePaymentForm}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="msisdn"
            className="block text-sm font-medium text-gray-700"
          >
            MSISDN (e.g., +254712345678) *
          </label>
          <input
            type="text"
            id="msisdn"
            value={msisdn}
            onChange={(e) => setMsisdn(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Payment Details
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      {isFormSubmitted && !error && (
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
}
