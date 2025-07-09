import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        isPublished: true,
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        facultyId: params.facultyId,
        isPublished: true,
      },
    });

    const tuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (tuition) {
      return new NextResponse("Tuition already exists", { status: 400 });
    }
    if (!faculty || !course) {
      return new NextResponse("Faculty or Course not found", { status: 404 });
    }
    const amount = course.amount;
    const currency = "EUR";
    const externalId = `${user.id}-${params.courseId}`;
      const partyIdType = process.env.MOMO_PARTY_ID_TYPE as string;
    const partyId = user.emailAddresses?.[0]?.emailAddress || user.id;
    const payerMessage = `Tuition payment ${course?.title}`;
    const payeeNote = `Tuition payment ${course?.title}`;
    const apiKey = process.env.MOMO_API_KEY as string;
    const subscriptionKey = process.env.MOMO_PRIMARY_KEY as string;
    const baseUrl = process.env.MOMO_BASE_URL as string;
    const momoTokenUrl = `https://${baseUrl}/collection/token`;
    const momoTokenResponse = await fetch(momoTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        Authorization: `Basic ${apiKey}`,
      },
    });
    if (!momoTokenResponse.ok) {
      return new NextResponse("Failed to fetch Momo token", { status: 500 });
    }
    const momoTokenData = await momoTokenResponse.json();
    const momoToken = momoTokenData.access_token;

    const momoRequestToPayUrl = `https://${baseUrl}/collection/v1_0/requesttopay`;
    const requestToPayData = {
      amount,
      currency,
      externalId,
      payer: {
        partyIdType,
          partyId,
      },
      payerMessage,
      payeeNote,
    };
    const momoRequestToPayResponse = await fetch(momoRequestToPayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "X-Reference-Id": externalId,
        "api-key": apiKey,
        "X-Target-Environment": process.env.MOMO_TARGET_ENVIRONMENT as string,
        Authorization: `Bearer ${momoToken}`,
      },
      body: JSON.stringify(requestToPayData),
    });
    if (!momoRequestToPayResponse.ok) {
      return new NextResponse("Failed to request payment", { status: 500 });
    }
    await db.tuition.create({
      data: {
        userId: user.id,        
        courseId: params.courseId,     
      },
    });
  } catch (error) {
    console.log("COURSE CHECKOUT ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
