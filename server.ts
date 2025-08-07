import cron from "node-cron";
import { publishScheduledContent } from "@/lib/cron/publish-content";
import { sendDraftReminders } from "@/lib/notifications/send-reminder";

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled content publication...");
  publishScheduledContent();
}, {
  timezone: "Africa/Nairobi",
});

cron.schedule("0 8 * * *", () => {
  console.log("Sending draft reminders...");
  sendDraftReminders();
}, {
  timezone: "Africa/Nairobi",
});