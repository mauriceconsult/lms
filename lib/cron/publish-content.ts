import { db } from "../db";

export async function publishScheduledContent() {
  try {
    const now = new Date();

    // Publish courseworks
    const courseworks = await db.coursework.findMany({
      where: {
        isPublished: false,
        publishDate: {
          lte: now,
          not: null,
        },
      },
    });

    for (const coursework of courseworks) {
      await db.coursework.update({
        where: { id: coursework.id },
        data: { isPublished: true, publishDate: null },
      });
      console.log(`Published coursework: ${coursework.title}`);
    }

    // Publish noticeboards
    const noticeboards = await db.noticeboard.findMany({
      where: {
        isPublished: false,
        publishDate: {
          lte: now,
          not: null,
        },
      },
    });

    for (const noticeboard of noticeboards) {
      await db.noticeboard.update({
        where: { id: noticeboard.id },
        data: { isPublished: true, publishDate: null },
      });
      console.log(`Published noticeboard: ${noticeboard.title}`);
    }
  } catch (error) {
    console.error("Error publishing scheduled content:", error);
  }
}
