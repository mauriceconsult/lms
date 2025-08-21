// import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const { userId } = await req.json(); // Changed to req.json() to match form data

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: { id: true, title: true, amount: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    if (!course.amount) {
      return NextResponse.json(
        { success: false, message: "Course is free" },
        { status: 400 }
      );
    }

    const paymentResponse = await initiateMoMoPayment({
      userId,
      courseId,
      amount: course.amount,
      returnUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/callback`,
    });

    return NextResponse.json({
      success: true,
      data: { paymentUrl: paymentResponse.paymentUrl },
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()} API] Checkout error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function initiateMoMoPayment({
  userId,
  courseId,
  amount,
  returnUrl,
}: {
  userId: string;
  courseId: string;
  amount: string;
  returnUrl: string;
}) {
  const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMOTEST";
  const accessKey = process.env.MOMO_ACCESS_KEY || "your-access-key";
  const secretKey = process.env.MOMO_SECRET_KEY || "your-secret-key";
  const orderId = `order_${courseId}_${Date.now()}`;
  const requestId = `req_${courseId}_${Date.now()}`;
  const orderInfo = `Payment for course ${courseId}`;
  const ipnUrl = returnUrl;

  // Generate MoMo signature
  const rawData = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&requestType=captureWallet`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawData)
    .digest("hex");

  try {
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create", // MoMo sandbox
      {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        returnUrl,
        ipnUrl,
        extraData: Buffer.from(JSON.stringify({ userId, courseId })).toString(
          "base64"
        ),
        requestType: "captureWallet",
        signature,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(`[${new Date().toISOString()} MoMo] Initiating payment:`, {
      paymentUrl: response.data.payUrl,
      orderId,
      signature,
    });

    return {
      paymentUrl: response.data.payUrl,
      transactionId: orderId,
    };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} MoMo] Payment initiation error:`,
      error
    );
    throw new Error("Failed to initiate MoMo payment");
  }
}
