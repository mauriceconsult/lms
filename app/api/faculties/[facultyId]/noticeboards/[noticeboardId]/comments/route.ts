import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { facultyId, noticeboardId } = req.query as { facultyId: string; noticeboardId: string };

  if (req.method === "POST") {
    const { content } = req.body;

    try {
      const comment = await db.comment.create({
        data: {
          content,
              userId,
          
          noticeboardId,
        },
      });
      return res.status(200).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
      return res.status(500).json({ error: "Failed to create comment" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
