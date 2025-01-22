import mongoose from "mongoose";

const messageQueueSchema = new mongoose.Schema({
  instance_id: String,
  sender: String,
  sectionId: String,
  message: String,
  minIntervalMs: Number,
  maxIntervalMs: Number,
  campainid: String,
  scheduleTime: Date,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const MessageQueue = mongoose.model("MessageQueue", messageQueueSchema);
