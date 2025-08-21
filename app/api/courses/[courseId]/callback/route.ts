import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    extraData,
    signature,
  } = await req.json();

  if (
    !validateMoMoSignature({
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      extraData,
      signature,
    })
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  if (resultCode !== 0) {
    return NextResponse.json(
      { success: false, message: "Payment failed" },
      { status: 400 }
    );
  }

  try {
    const { userId, courseId: parsedCourseId } = JSON.parse(
      Buffer.from(extraData, "base64").toString()
    );
    if (parsedCourseId !== courseId) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const enrollment = await db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: {
        userId,
        courseId,
      },
    });

    await db.tuition.create({
      data: {
        userId,
        courseId,
        amount: course.amount || "0",
        // transactionId: transId,
        // status: "completed",
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error(`[${new Date().toISOString()} API] Callback error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

function validateMoMoSignature({
  partnerCode,
  orderId,
  requestId,
  amount,
  orderInfo,
  orderType,
  transId,
  extraData,
  signature,
}: {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  extraData: string;
  signature: string;
}): boolean {
  const secretKey = process.env.MOMO_SECRET_KEY || "your-secret-key";
  const rawData = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;
  const computedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawData)
    .digest("hex");
  return computedSignature === signature;
}
