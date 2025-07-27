import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Collections } from "mtn-momo";
import { PartyIdType } from "mtn-momo/lib/common";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Validate user
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate course
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    if (!course.amount) {
      return new NextResponse("Course amount not specified", { status: 400 });
    }

    // Check for existing tuition
    const existingTuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (existingTuition) {
      return new NextResponse("Tuition already exists", { status: 400 });
    }

    // Initialize Momo client
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

    // Prepare Momo payment
    const externalId = `${user.id}-${params.courseId}`;
    const payerMessage = `Tuition payment for ${course.title}`;
    const payeeNote = `Tuition payment for ${course.title}`;
    const currency = "EUR"; // Adjust based on Momo API requirements
    const partyIdType = (process.env.MOMO_PARTY_ID_TYPE || "EMAIL") as PartyIdType;
    const partyId = user.emailAddresses[0].emailAddress; // Use email or phone number

    // Request payment
    const transactionId = await collections.requestToPay({
      amount: course.amount, // Already a string
      currency,
      externalId,
      payer: {
        partyIdType,
        partyId,
      },
      payerMessage,
      payeeNote,
    });

    // Verify transaction (optional)
    const transaction = await collections.getTransaction(transactionId);
    if (transaction.status !== "SUCCESSFUL") {
      return new NextResponse(`Payment failed: ${transaction.reason || "Unknown error"}`, { status: 400 });
    }

    // Create tuition record
    // const tuition = await db.tuition.create({
    //   data: {
    //     userId: user.id,
    //     courseId: params.courseId,
    //     amount: course.amount,
    //   },
    // });

    return NextResponse.json({
      transactionId,
      // tuition
    }, { status: 200 });
  } catch (error) {
    console.error("[COURSE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}