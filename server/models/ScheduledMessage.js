const mongoose = require("mongoose");

const ScheduledMessageSchema = new mongoose.Schema({
  instance_id: String,
  sender: String,
  sectionId: String,
  message: String,
  minIntervalMs: Number,
  maxIntervalMs: Number,
  campainid: String,
  filename: String,
  media_url: String,
  scheduleTime: Date,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ScheduledMessage", ScheduledMessageSchema);
