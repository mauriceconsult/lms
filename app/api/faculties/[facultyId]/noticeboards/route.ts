import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { facultyId } = req.query as { facultyId: string };

  if (req.method === "POST") {
    const { title, description, isPublished, publishDate } = req.body;

    try {
      const noticeboard = await db.noticeboard.create({
        data: {
          title,
          description,
          isPublished,
          publishDate: isPublished ? null : publishDate ? new Date(publishDate) : null,
          userId,
          facultyId,
        },
      });
      return res.status(200).json(noticeboard);
    } catch (error) {
        console.error("Error creating noticeboard:", error);
      return res.status(500).json({ error: "Failed to create noticeboard" });
    }
  }

  if (req.method === "GET") {
    try {
      const noticeboards = await db.noticeboard.findMany({
        where: { facultyId },
      });
      return res.status(200).json(noticeboards);
    } catch (error) {
        console.error("Error fetching noticeboards:", error);
      return res.status(500).json({ error: "Failed to fetch noticeboards" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
;
