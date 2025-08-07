import { NextApiRequest, NextApiResponse } from "next";
import { publishScheduledContent } from "@/lib/cron/publish-content";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-cron-secret"];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await publishScheduledContent();
    return res.status(200).json({ message: "Scheduled content published" });
  } catch (error) {
    console.error("Error in cron job:", error);
    return res.status(500).json({ error: "Failed to publish content" });
  }
}
