// app/api/faculties/[facultyId]/courses/[courseId]/checkout/route.ts
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Collections } from "mtn-momo";
import { PartyIdType } from "mtn-momo/lib/common";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { facultyId, courseId } = await params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        facultyId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    if (!course.amount) {
      return new NextResponse("Course amount not specified", { status: 400 });
    }

    const { msisdn, amount, partyId } = await request.json(); // Removed username
    if (!msisdn || !partyId || amount !== course.amount) {
      return new NextResponse("Invalid payment details", { status: 400 });
    }

    const existingTuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });
    if (!existingTuition) {
      return new NextResponse("Tuition record not found", { status: 400 });
    }
    if (existingTuition.isPaid) {
      return new NextResponse("Tuition already paid", { status: 400 });
    }

    const subscriptionKey = process.env.MOMO_PRIMARY_KEY;
    const apiKey = process.env.MOMO_API_KEY;
    const apiUser = process.env.MOMO_API_USER;
    const targetEnvironment = process.env.MOMO_TARGET_ENVIRONMENT || "sandbox";
    if (!subscriptionKey || !apiKey || !apiUser) {
      return new NextResponse("Momo configuration missing", { status: 500 });
    }

    const collections = new Collections({
      userId: apiUser,
      userSecret: apiKey,
      primaryKey: subscriptionKey,
      environment: targetEnvironment as "sandbox" | "live",
    });

    const externalId = `${user.id}-${courseId}`;
    const payerMessage = `Tuition payment for ${course.title}`;
    const payeeNote = `Tuition payment for ${course.title}`;
    const currency = "EUR";
    const partyIdType: PartyIdType = (process.env.MOMO_PARTY_ID_TYPE ||
      "MSISDN") as PartyIdType;

    const transactionId = await collections.requestToPay({
      amount: course.amount,
      currency,
      externalId,
      payer: {
        partyIdType,
        partyId,
      },
      payerMessage,
      payeeNote,
    });

    const transaction = await collections.getTransaction(transactionId);
    if (transaction.status !== "SUCCESSFUL") {
      return new NextResponse(
        `Payment failed: ${transaction.reason || "Unknown error"}`,
        { status: 400 }
      );
    }

    await db.tuition.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      data: {
        isPaid: true,
        isActive: true,
      },
    });

    // Replace with actual logic to fetch firstTutorId
    const firstTutorId = "some-tutor-id";
    return NextResponse.json(
      { success: true, transactionId, firstTutorId },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
