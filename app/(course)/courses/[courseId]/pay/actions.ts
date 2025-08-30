// app/(course)/courses/[courseId]/pay/actions.ts
"use server";

import { collections } from "@/lib/momo";
import { prisma } from "@/lib/prisma";
import { Buffer } from "buffer";
import { currentUser } from "@clerk/nextjs/server";

export async function processPayment(data: {
  username: string;
  msisdn: string;
  courseId: string;
  amount?: string;
}) {
  const user = await currentUser();
  if (!user) {
    console.error("[processPayment] Error: No authenticated user");
    throw new Error("User must be authenticated");
  }

  if (!data.amount) {
    console.error("[processPayment] Error: Amount is required");
    throw new Error("Course amount is required for payment");
  }

  try {
    const existingTuition = await prisma.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: data.courseId,
        },
      },
    });

    const partyId = Buffer.from(data.msisdn).toString("base64"); // Use const

    if (!existingTuition) {
      await prisma.tuition.create({
        data: {
          username: data.username,
          partyId,
          courseId: data.courseId,
          userId: user.id,
        },
      });
      console.log(
        "[processPayment] Created new tuition with partyId:",
        partyId
      );
    } else if (existingTuition.partyId !== partyId) {
      await prisma.tuition.update({
        where: {
          userId_courseId: { userId: user.id, courseId: data.courseId },
        },
        data: { partyId },
      });
      console.log(
        "[processPayment] Updated partyId to match form MSISDN:",
        partyId
      );
    } else {
      console.log(
        "[processPayment] User already enrolled, using existing partyId:",
        partyId
      );
    }

    const cleanAmount = data.amount.replace(/[^0-9]/g, "");
    if (!cleanAmount || cleanAmount === "0") {
      throw new Error("Invalid amount provided");
    }
    console.log("[processPayment] Clean Amount:", cleanAmount);

    const transactionId = await collections.requestToPay({
      amount: cleanAmount,
      currency: "EUR", // Sandbox requires EUR
      externalId: `instaskul_${data.courseId}_${Date.now()}`,
      payer: {
        partyIdType: "MSISDN",
        partyId: data.msisdn,
      },
      payerMessage: `Enrollment for course ${data.courseId}`,
      payeeNote: "InstaSkul course enrollment",
    });

    console.log("[processPayment] Transaction ID:", transactionId);

    // Check transaction status
    const statusResponse = await collections.checkTransactionStatus(
      transactionId
    );
    console.log("[processPayment] Transaction Status:", statusResponse);

    if (statusResponse.status !== "SUCCESSFUL") {
      throw new Error(`Transaction not successful: ${statusResponse.status}`);
    }

    return { success: true, transactionId };
  } catch (error) {
    console.error("[processPayment] Error:", {
      message: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Failed to process payment");
  }
}
