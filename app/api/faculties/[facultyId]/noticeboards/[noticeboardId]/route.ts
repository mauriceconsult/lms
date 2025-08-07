import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { facultyId, noticeboardId } = req.query as { facultyId: string; noticeboardId: string };

  if (req.method === "PATCH") {
    const { isPublished, publishDate } = req.body;

    try {
      const noticeboard = await db.noticeboard.update({
        where: { id: noticeboardId, facultyId },
        data: {
          isPublished,
          publishDate: isPublished ? null : publishDate ? new Date(publishDate) : null,
        },
      });
      return res.status(200).json(noticeboard);
    } catch (error) {
        console.error("Error updating noticeboard:", error);
      return res.status(500).json({ error: "Failed to update noticeboard" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
