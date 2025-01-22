const { ScheduledMessage } = require("../models/ScheduledMessage");
const {
  sendMessages,
  sendMessagesmedia,
} = require("../controller/waController");

async function processScheduledMessages() {
  console.log("hello");
  try {
    const now = new Date();
    const messages = await ScheduledMessage.find({
      scheduleTime: { $lte: now },
      status: "pending",
    }).sort("scheduleTime");

    for (const message of messages) {
      message.status = "processing";
      await message.save();

      try {
        if (message.media_url) {
          await sendMessagesmedia(
            message.instance_id,
            message.sender,
            message.sectionId,
            message.message,
            message.minIntervalMs,
            message.maxIntervalMs,
            message.campainid,
            message.filename,
            message.media_url
          );
        } else {
          await sendMessages(
            message.instance_id,
            message.sender,
            message.sectionId,
            message.message,
            message.minIntervalMs,
            message.maxIntervalMs,
            message.campainid
          );
        }

        message.status = "completed";
      } catch (error) {
        console.error("Error processing scheduled message:", error);
        message.status = "failed";
      }

      await message.save();
    }
  } catch (error) {
    console.error("Error in processScheduledMessages:", error);
  }
}

// Run the worker every minute
setInterval(processScheduledMessages, 2000);

// Start processing immediately
processScheduledMessages();
