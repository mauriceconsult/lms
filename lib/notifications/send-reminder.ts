import { format } from "date-fns";
import { sendEmail } from "@/lib/email"; // Hypothetical email service
import { db } from "../db";

export async function sendDraftReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Coursework reminders
  const courseworks = await db.coursework.findMany({
    where: {
      isPublished: false,
      publishDate: {
        lte: tomorrow,
        gte: new Date(),
        not: null,
      },
    },
    include: { faculty: true },
  });

  for (const coursework of courseworks) {
    await sendEmail({
      to: coursework.faculty.userId,
      subject: `Reminder: Publish ${coursework.title} Soon`,
      body: `Your coursework "${coursework.title}" is scheduled to publish on ${format(coursework.publishDate!, "PPP")}. Please review or publish manually if needed.`,
    });
  }

  // Noticeboard reminders
  const noticeboards = await db.noticeboard.findMany({
    where: {
      isPublished: false,
      publishDate: {
        lte: tomorrow,
        gte: new Date(),
        not: null,
      },
    },
    include: { faculty: true },
  });

  for (const noticeboard of noticeboards) {
    await sendEmail({
      to: noticeboard.faculty.userId,
      subject: `Reminder: Publish ${noticeboard.title} Soon`,
      body: `Your notice "${noticeboard.title}" is scheduled to publish on ${format(noticeboard.publishDate!, "PPP")}. Please review or publish manually if needed.`,
    });
  }
}
