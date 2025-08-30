// lib/momo.ts
import axios, { AxiosError } from "axios";

interface MoMoErrorResponse {
  message?: string;
}

export const collections = {
  async requestToPay({
    amount,
    currency,
    externalId,
    payer,
    payerMessage,
    payeeNote,
  }: {
    amount: string;
    currency: string;
    externalId: string;
    payer: { partyIdType: string; partyId: string };
    payerMessage: string;
    payeeNote: string;
  }) {
    try {
      const referenceId = crypto.randomUUID(); // Generate UUID upfront
      console.log("[MoMo] requestToPay Payload:", {
        amount,
        currency,
        externalId,
        payer,
        payerMessage,
        payeeNote,
        referenceId,
      });
      const response = await axios.post(
        "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
        {
          amount,
          currency,
          externalId,
          payer,
          payerMessage,
          payeeNote,
        },
        {
          headers: {
            "X-Reference-Id": referenceId,
            "X-Target-Environment": "sandbox",
            "Ocp-Apim-Subscription-Key": process.env.MOMO_PRIMARY_KEY!,
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log("[MoMo] requestToPay Success:", {
        data: response.data,
        headers: response.headers,
        status: response.status,
      });
      return referenceId; // Return the generated UUID
    } catch (error) {
      const axiosError = error as AxiosError<MoMoErrorResponse>;
      console.error("[MoMo] requestToPay Error:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw new Error(
        `MoMo requestToPay failed: ${
          axiosError.response?.data?.message || axiosError.message
        }`
      );
    }
  },

  async checkTransactionStatus(transactionId: string) {
    try {
      const response = await axios.get(
        `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${transactionId}`,
        {
          headers: {
            "X-Target-Environment": "sandbox",
            "Ocp-Apim-Subscription-Key": process.env.MOMO_PRIMARY_KEY!,
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log("[MoMo] checkTransactionStatus Success:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<MoMoErrorResponse>;
      console.error("[MoMo] checkTransactionStatus Error:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw new Error(
        `MoMo status check failed: ${
          axiosError.response?.data?.message || axiosError.message
        }`
      );
    }
  },
};

async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/token/",
      {},
      {
        auth: {
          username: process.env.MOMOUSER_ID!,
          password: process.env.MOMOUSER_SECRET!,
        },
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.MOMO_PRIMARY_KEY!,
        },
      }
    );
    console.log("[MoMo] getAccessToken Success:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    const axiosError = error as AxiosError<MoMoErrorResponse>;
    console.error("[MoMo] getAccessToken Error:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw new Error(
      `MoMo getAccessToken failed: ${
        axiosError.response?.data?.message || axiosError.message
      }`
    );
  }
}
