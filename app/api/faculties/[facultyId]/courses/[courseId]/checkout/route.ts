"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Collections } from "mtn-momo";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} CheckoutAPI] Unauthorized: No userId`
    );
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { facultyId, courseId } = await params;
  const body = await request.json();
  const { partyId, amount } = body;

  if (!partyId || !amount) {
    console.log(
      `[${new Date().toISOString()} CheckoutAPI] Invalid request: Missing partyId or amount`
    );
    return new NextResponse("Invalid request", { status: 400 });
  }

  // Validate amount as a string representing a positive number
  if (typeof amount !== "string" || !/^\d+(\.\d{1,2})?$/.test(amount)) {
    console.log(
      `[${new Date().toISOString()} CheckoutAPI] Invalid amount format: ${amount} (must be a string like '100.00')`
    );
    return new NextResponse("Invalid amount format (e.g., '100.00')", {
      status: 400,
    });
  }

  try {
    // Verify course and faculty
    const course = await db.course.findUnique({
      where: { id: courseId, facultyId },
      select: {
        id: true,
        amount: true,
        isPublished: true,
        tutors: {
          select: { id: true, isPublished: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} CheckoutAPI] Course not found: ${courseId}`
      );
      return new NextResponse("Course not found", { status: 404 });
    }

    if (!course.isPublished) {
      console.log(
        `[${new Date().toISOString()} CheckoutAPI] Course not published: ${courseId}`
      );
      return new NextResponse("Course not published", { status: 400 });
    }

    if (course.amount === null) {
      console.log(
        `[${new Date().toISOString()} CheckoutAPI] Course amount is null: ${courseId}`
      );
      return new NextResponse("Course amount not set", { status: 400 });
    }

    // Compare amounts as strings
    if (course.amount !== amount) {
      console.log(
        `[${new Date().toISOString()} CheckoutAPI] Amount mismatch: ${amount} vs ${
          course.amount
        }`
      );
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    // Initialize MoMo
    const collections = Collections({
      userSecret: process.env.MOMO_COLLECTIONS_USER_SECRET!,
      userId: process.env.MOMO_COLLECTIONS_USER_ID!,
      primaryKey: process.env.MOMO_COLLECTIONS_PRIMARY_KEY!,
    });

    // Request to pay
    const transactionId = await collections.requestToPay({
      amount: amount,
      currency: "EUR", // Sandbox uses EUR
      externalId: `${userId}-${courseId}`,
      payer: {
        partyIdType: "MSISDN",
        partyId: partyId,
      },
      payerMessage: `Payment for course: ${courseId}`,
      payeeNote: "InstaSkul course enrollment",
    });

    console.log(
      `[${new Date().toISOString()} CheckoutAPI] MoMo payment initiated`,
      { transactionId, courseId, userId, amount }
    );

    // Poll transaction status
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s
      const transaction = await collections.getTransaction(transactionId);
      console.log(
        `[${new Date().toISOString()} CheckoutAPI] Transaction status`,
        {
          transactionId,
          status: transaction.status,
          transactionAmount: transaction.amount,
        }
      );

      if (transaction.status === "SUCCESSFUL") {
        // Validate transaction amount matches
        if (transaction.amount !== amount) {
          console.log(
            `[${new Date().toISOString()} CheckoutAPI] Transaction amount mismatch: ${
              transaction.amount
            } vs ${amount}`
          );
          return new NextResponse("Transaction amount mismatch", {
            status: 400,
          });
        }

        // Update UserProgress
        await db.userProgress.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: { isEnrolled: true },
          create: { userId, courseId, isEnrolled: true },
        });

        const firstTutorId =
          course.tutors.length > 0 ? course.tutors[0].id : null;
        console.log(
          `[${new Date().toISOString()} CheckoutAPI] Enrollment successful`,
          { transactionId, courseId, userId, firstTutorId }
        );

        return NextResponse.json({
          success: true,
          transactionId,
          firstTutorId,
        });
      }

      if (
        transaction.status === "FAILED" ||
        transaction.status === "REJECTED"
      ) {
        console.log(
          `[${new Date().toISOString()} CheckoutAPI] Payment failed`,
          { transactionId, status: transaction.status }
        );
        return new NextResponse("Payment failed", { status: 400 });
      }

      attempts++;
    }

    console.log(
      `[${new Date().toISOString()} CheckoutAPI] Payment timeout after ${maxAttempts} attempts`,
      { transactionId }
    );
    return new NextResponse("Payment timeout", { status: 408 });
  } catch (error) {
    console.error(`[${new Date().toISOString()} CheckoutAPI] Error:`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
