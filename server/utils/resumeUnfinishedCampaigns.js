const Campaign = require("../models/campains");
const { Section } = require("../models/section");
const { RecipientNumber } = require("../models/recipaintnumber");
// const ScheduledMessageSchema = require("../models/ScheduledMessage");
const ScheduledMessage = require("../models/ScheduledMessage");

async function loadCampaignProgress(campaignId) {
  const progressFile = path.join(
    __dirname,
    "..",
    "data",
    `campaign_${campaignId}_progress.json`
  );
  try {
    const data = await fs.readFile(progressFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { lastProcessedIndex: -1 };
    }
    throw error;
  }
}

async function saveCampaignProgress(campaignId, lastProcessedIndex) {
  const progressFile = path.join(
    __dirname,
    "..",
    "data",
    `campaign_${campaignId}_progress.json`
  );
  await fs.writeFile(progressFile, JSON.stringify({ lastProcessedIndex }));
}

async function sendMessages(
  instance_id,
  sender,
  sectionId,
  message,
  minIntervalMs,
  maxIntervalMs,
  campainid
) {
  console.log("hi");
  const access_token = "64da53e6c44e5";
  const hisocialWhatsAppEndpoint = "https://hisocial.in/api/send";
  const trackingServiceUrl =
    "http://localhost:5001/api/v1/groups/track-message/excel";
  const maxRetries = 3;
  const batchSize = 1000;
  const breakTimeMs = 5 * 60 * 1000;
  console.log("insteanceId->", instance_id);
  console.log("sender->", sender);
  console.log("sectionId->", sectionId);
  try {
    const section = await Section.findById(sectionId).populate("user");
    console.log(section);
    if (!section) {
      console.error("Section not found.");
      return;
    }

    const campain = await Campaign.findById(campainid);
    if (!campain) {
      console.error("Campaign not found.");
      return;
    }

    const recipientNumbers = await RecipientNumber.find({ section: sectionId });
    const user = await Client.findById(section.user._id);

    if (!user) {
      console.error("Client not found.");
      return;
    }

    const minimum = user.Totalcredit;
    const counts = section.count * user.whatsappmodel.cm;

    if (minimum < counts) {
      campain.failureCount += section.count;
      await campain.save();
      await fetch(trackingServiceUrl, {
        method: "POST",
        body: JSON.stringify({
          clientId: user._id,
          sender: sender,
          attachment: "No",
          campainid: campainid,
          status: "Failed",
          Remark: "Please check your credit is low or contact admin",
        }),
        headers: { "Content-Type": "application/json" },
      });
      return;
    }

    let successCount = campain.successCount || 0;
    let failureCount = campain.failureCount || 0;
    const { lastProcessedIndex } = await loadCampaignProgress(campainid);
    let totalRecipientsProcessed = lastProcessedIndex + 1;

    for (let i = 0; i < recipientNumbers.length; i++) {
      const recipient = recipientNumbers[i];
      for (let j = 0; j < recipient.contactNumbers.length; j++) {
        if (totalRecipientsProcessed <= lastProcessedIndex) {
          totalRecipientsProcessed++;
          continue;
        }

        const contact = recipient.contactNumbers[j];
        let attempt = 0;
        let messageSent = false;

        while (attempt < maxRetries && !messageSent) {
          let customizedMessage = message
            .replace("%param1%", contact.Param1 || "")
            .replace("%param2%", contact.Param2 || "")
            .replace("%param3%", contact.Param3 || "")
            .replace("%param4%", contact.Param4 || "")
            .replace("%param5%", contact.Param5 || "");

          customizedMessage = customizedMessage.replace(/%param\d%/g, "");

          const payload = {
            clientId: user._id,
            sender: sender,
            number: contact.number,
            type: "text",
            message: customizedMessage,
            instance_id: instance_id,
            access_token: access_token,
          };

          try {
            const response = await fetch(hisocialWhatsAppEndpoint, {
              method: "POST",
              body: JSON.stringify(payload),
              headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            const status =
              data.status === "success" && data.message?.key?.fromMe === true
                ? "success"
                : "Failed";
            let remark = "Message sent successfully";

            if (status === "success") {
              successCount++;
              user.Totalcredit -= user.whatsappmodel.cm;
              user.creditused += user.whatsappmodel.cm;
              await user.save();
              messageSent = true;
            } else {
              throw new Error("Failed to send message");
            }

            await fetch(trackingServiceUrl, {
              method: "POST",
              body: JSON.stringify({
                clientId: user._id,
                sender: sender,
                attachment: "No",
                recipient: contact.number,
                content: customizedMessage,
                campainid: campainid,
                status: status,
                Remark: remark,
              }),
              headers: { "Content-Type": "application/json" },
            });

            console.log(
              `Message ${
                status === "success" ? "sent successfully" : "Failed"
              } to ${contact.number}`
            );
          } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
              failureCount++;
              const remark =
                "Please check if Instance ID is active or contact admin";
              await fetch(trackingServiceUrl, {
                method: "POST",
                body: JSON.stringify({
                  clientId: user._id,
                  sender: sender,
                  attachment: "No",
                  recipient: contact.number,
                  content: customizedMessage,
                  campainid: campainid,
                  status: "Failed",
                  Remark: remark,
                }),
                headers: { "Content-Type": "application/json" },
              });
              console.error(
                `Error sending message to ${contact.number}: ${error}`
              );
            } else {
              console.log(
                `Retrying message to ${contact.number} (attempt ${attempt})`
              );
            }
          }

          campain.successCount = successCount;
          campain.failureCount = failureCount;
          await campain.save();

          totalRecipientsProcessed++;
          await saveCampaignProgress(campainid, totalRecipientsProcessed - 1);

          console.log(`Processed ${totalRecipientsProcessed} recipients.`);

          if (
            totalRecipientsProcessed % batchSize === 0 &&
            totalRecipientsProcessed <
              recipientNumbers.reduce(
                (acc, curr) => acc + curr.contactNumbers.length,
                0
              )
          ) {
            console.log(
              `Taking a break for ${breakTimeMs / 1000 / 60} minutes.`
            );
            await new Promise(resolve => setTimeout(resolve, breakTimeMs));
          }

          const randomDelay =
            minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs);
          await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
      }
    }

    console.log(
      `Bulk WhatsApp messages sent. Success: ${successCount}, Failure: ${failureCount}`
    );
  } catch (error) {
    console.error("Error sending bulk WhatsApp messages:", error);
  }
}
async function sendMessagesmedia(
  instance_id,
  sender,
  sectionId,
  message,
  minIntervalMs,
  maxIntervalMs,
  campainid,
  filename,
  media_url
) {
  const access_token = "64da53e6c44e5";
  const hisocialWhatsAppEndpoint = "https://hisocial.in/api/send";
  const trackingServiceUrl =
    "http://localhost:5001/api/v1/groups/track-message/excel";
  const maxRetries = 3;
  const batchSize = 1000;
  const breakTimeMs = 5 * 60 * 1000;

  try {
    const section = await Section.findById(sectionId).populate("user");
    if (!section) {
      console.error("Section not found.");
      return;
    }

    const campain = await Campaign.findById(campainid);
    if (!campain) {
      console.error("Campaign not found.");
      return;
    }

    const recipientNumbers = await RecipientNumber.find({ section: sectionId });
    const user = await Client.findById(section.user._id);

    if (!user) {
      console.error("Client not found.");
      return;
    }
    const minimum = user.Totalcredit;
    let counts;
    if (message) {
      counts = section.count * (user.whatsappmodel.cmf + user.whatsappmodel.cm);
    } else {
      counts = section.count * user.whatsappmodel.cmf;
    }

    if (minimum < counts) {
      campain.failureCount += section.count;
      await campain.save();
      await fetch(trackingServiceUrl, {
        method: "POST",
        body: JSON.stringify({
          clientId: user._id,
          sender: sender,
          attachment: "Yes",
          campainid: campainid,
          status: "Failed",
          Remark: "Please check your credit is low or contact admin",
        }),
        headers: { "Content-Type": "application/json" },
      });
      return;
    }
    let successCount = campain.successCount || 0;
    let failureCount = campain.failureCount || 0;
    const { lastProcessedIndex } = await loadCampaignProgress(campainid);
    let totalRecipientsProcessed = lastProcessedIndex + 1;

    for (let i = 0; i < recipientNumbers.length; i++) {
      const recipient = recipientNumbers[i];
      for (let j = 0; j < recipient.contactNumbers.length; j++) {
        if (totalRecipientsProcessed <= lastProcessedIndex) {
          totalRecipientsProcessed++;
          continue;
        }

        const contact = recipient.contactNumbers[j];
        let attempt = 0;
        let messageSent = false;

        while (attempt < maxRetries && !messageSent) {
          let customizedMessage = message
            .replace("%param1%", contact.Param1 || "")
            .replace("%param2%", contact.Param2 || "")
            .replace("%param3%", contact.Param3 || "")
            .replace("%param4%", contact.Param4 || "")
            .replace("%param5%", contact.Param5 || "");

          customizedMessage = customizedMessage.replace(/%param\d%/g, "");

          const payload = {
            number: contact.number,
            type: "media",
            filename: filename,
            message: customizedMessage,
            media_url: media_url,
            instance_id: instance_id,
            access_token: access_token,
          };

          try {
            const response = await fetch(hisocialWhatsAppEndpoint, {
              method: "POST",
              body: JSON.stringify(payload),
              headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            const status =
              data.status === "success" && data.message?.key?.fromMe === true
                ? "success"
                : "Failed";
            let remark = "Message sent successfully";

            if (status === "success") {
              successCount++;
              user.Totalcredit -=
                user.whatsappmodel.cmf + user.whatsappmodel.cm;
              user.creditused += user.whatsappmodel.cmf + user.whatsappmodel.cm;
              await user.save();
              messageSent = true;
            } else {
              throw new Error("Failed to send message");
            }

            await fetch(trackingServiceUrl, {
              method: "POST",
              body: JSON.stringify({
                clientId: user._id,
                sender: sender,
                attachment: "Yes",
                recipient: contact.number,
                content: customizedMessage,
                campainid: campainid,
                status: status,
                Remark: remark,
              }),
              headers: { "Content-Type": "application/json" },
            });

            console.log(
              `Message ${
                status === "success" ? "sent successfully" : "Failed"
              } to ${contact.number}`
            );
          } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
              failureCount++;
              const remark =
                "Please check if Instance ID is active or contact admin";
              await fetch(trackingServiceUrl, {
                method: "POST",
                body: JSON.stringify({
                  clientId: user._id,
                  sender: sender,
                  attachment: "Yes",
                  recipient: contact.number,
                  content: customizedMessage,
                  campainid: campainid,
                  status: "Failed",
                  Remark: remark,
                }),
                headers: { "Content-Type": "application/json" },
              });
              console.error(
                `Error sending message to ${contact.number}: ${error}`
              );
            } else {
              console.log(
                `Retrying message to ${contact.number} (attempt ${attempt})`
              );
            }
          }

          campain.successCount = successCount;
          campain.failureCount = failureCount;
          await campain.save();

          totalRecipientsProcessed++;
          await saveCampaignProgress(campainid, totalRecipientsProcessed - 1);

          console.log(`Processed ${totalRecipientsProcessed} recipients.`);

          if (
            totalRecipientsProcessed % batchSize === 0 &&
            totalRecipientsProcessed <
              recipientNumbers.reduce(
                (acc, curr) => acc + curr.contactNumbers.length,
                0
              )
          ) {
            console.log(
              `Taking a break for ${breakTimeMs / 1000 / 60} minutes.`
            );
            await new Promise(resolve => setTimeout(resolve, breakTimeMs));
          }

          const randomDelay =
            minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs);
          await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
      }
    }

    console.log(
      `Bulk WhatsApp messages sent. Success: ${successCount}, Failure: ${failureCount}`
    );
  } catch (error) {
    console.error("Error sending bulk WhatsApp messages:", error);
  }
}

async function resumeUnfinishedCampaigns() {
  try {
    const unfinishedMessages = await ScheduledMessage.find({
      status: "processing",
    });
    console.log("unfinished->", unfinishedMessages);
    for (const message of unfinishedMessages) {
      console.log(`Resuming scheduled message ${message._id}`);
      console.log(message);

      if (message.media_url) {
        await sendMessagesmedia(
          message.instance_id,
          message.sender,
          message.sectionId,
          message.message,
          message.minIntervalMs,
          message.maxIntervalMs,
          message._id,
          message.filename,
          message.media_url
        );
      } else {
        console.log("Single message");
        await sendMessages(
          message.instance_id,
          message.sender,
          message.sectionId,
          message.message,
          message.minIntervalMs,
          message.maxIntervalMs,
          message._id
        );
      }

      message.status = "completed";
      await message.save();
    }

    console.log(
      "All unfinished scheduled messages have been resumed and completed."
    );
  } catch (error) {
    console.error("Error resuming unfinished scheduled messages:", error);
  }
}

module.exports = { resumeUnfinishedCampaigns };
