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
  try {
    const paymentUrl = `https://momo.example.com/pay?userId=${userId}&courseId=${courseId}&amount=${amount}&returnUrl=${encodeURIComponent(
      returnUrl
    )}`;
    const transactionId = "txn_" + Math.random().toString(36).substring(2);

    console.log(`[${new Date().toISOString()} MoMo] Initiating payment:`, {
      paymentUrl,
      transactionId,
      returnUrl,
    });

    return { paymentUrl, transactionId };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} MoMo] Payment initiation error:`,
      error
    );
    throw new Error("Failed to initiate MoMo payment");
  }
}
