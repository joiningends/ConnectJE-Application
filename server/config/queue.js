const Queue = require("bull");
const Redis = require("ioredis");

// Create a new Redis client
const client = new Redis(process.env.REDIS_URL);
const subscriber = new Redis(process.env.REDIS_URL);

// Create our job queue
const messageQueue = new Queue("message-queue", {
  createClient: function (type) {
    switch (type) {
      case "client":
        return client;
      case "subscriber":
        return subscriber;
      default:
        return new Redis(process.env.REDIS_URL);
    }
  },
});

module.exports = messageQueue;
