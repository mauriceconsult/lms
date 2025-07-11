import { db } from "@/lib/db";
import { collections } from "@/lib/momo";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PartyIdType } from "mtn-momo/lib/common";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
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
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    const currency = "EUR";
    const partyIdType = process.env.MOMO_PARTY_ID_TYPE as PartyIdType;
    const externalId = `${user.id}-${params.courseId}`;
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

    const partyId = await db.tuition
      .findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: params.courseId,
          },
        },
      })
      .then((tuition) => {
        if (!tuition || !tuition.partyId) {
          throw new Error("Party ID not found for the user");
        }
        return tuition.partyId;
      })
      .catch((error) => {
        console.error("Error fetching party ID:", error);
        throw new Error("Party ID not found");
      });
    const momoCustomer = await collections
      .requestToPay({
        amount: course?.amount!.toString(),
        currency,
        externalId,
        payer: {
          partyIdType: partyIdType as PartyIdType,
          partyId,
        },
        payerMessage,
        payeeNote,
      })
      .then((transactionId) => {
        console.log({ transactionId });

        // Get transaction status
        return collections.getTransaction(transactionId);
      })
      .then((transaction) => {
        console.log({ transaction });

        // Get account balance
        return collections.getBalance();
      })
      .then((accountBalance) => console.log({ accountBalance }))
      .catch((error) => {
        console.log(error);
      });

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
      body: JSON.stringify(momoCustomer),
    });
    if (!momoRequestToPayResponse.ok) {
      return new NextResponse("Failed to request payment", { status: 500 });
    }

    // await db.tuition.create({
    //   data: {
    //     userId: user.id,
    //     courseId: params.courseId,
    //   },
    // });
  } catch (error) {
    console.log("COURSE CHECKOUT ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
