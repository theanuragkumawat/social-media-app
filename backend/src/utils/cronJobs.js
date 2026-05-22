import cron from "node-cron";
import { Story } from "../models/story.model.js"; // Update with your actual path

// This cron job runs every hour at minute 0 (e.g., 1:00, 2:00, 3:00)
// You can change "0 * * * *" to "*/15 * * * *" to run it every 15 minutes if you want it more exact
cron.schedule("0 * * * *", async () => {
    try {
        console.log("Running cron job: Archiving expired stories...");

        // Calculate the time 24 hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find all stories created more than 24 hours ago that aren't already archived
        const result = await Story.updateMany(
            {
                createdAt: { $lte: twentyFourHoursAgo },
                status: { $ne: "archive" } // Prevents updating stories already archived
            },
            {
                $set: { status: "archive" }
            }
        );

        console.log(`Archived ${result.modifiedCount} stories successfully.`);
    } catch (error) {
        console.error("Error archiving stories in cron job:", error);
    }
});