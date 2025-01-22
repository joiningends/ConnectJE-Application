const Event = require("../models/eventmodel");
const Registration = require("../models/registercustomer");
const { sendEmail } = require("../controller/emailController");
const Role = require("../models/role");
const EmailConfig = require("../models/emailconfig");
const mongoose = require("mongoose");
const Slot = require("../models/eventSlots");
const moment = require('moment-timezone'); 
//-----------------------------IN USE----------------------------------
const { generateTimeSlots } = require("../utils/generateTimeSlot")





//----------------------------------- NOT USING ---------------------------------------
const generateTimeslots = (
  startTime,
  endTime,
  sessionDuration,
  eventDate,
  endDate
) => {
  const timeslots = [];
  console.log(startTime, endTime, sessionDuration, eventDate, endDate);

  const convertToMinutes = time => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = minutes => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // 'DD-MM-YYYY' format
  };

  const parseDate = dateStr => {
    const [day, month, year] = dateStr.split("-").map(Number); // Adjusted for 'DD-MM-YYYY' format
    return new Date(year, month - 1, day); // Month is 0-indexed in JS
  };

  const totalEventStartTime = convertToMinutes(startTime);
  const totalEventEndTime = convertToMinutes(endTime);
  const totalEventDuration = totalEventEndTime - totalEventStartTime;

  if (totalEventDuration >= sessionDuration) {
    const numSlotsPerCounter = Math.floor(totalEventDuration / sessionDuration);
    console.log("Total Event Duration:", totalEventDuration);
    console.log("Number of Slots Per Counter:", numSlotsPerCounter);

    const generateTimeslotsForDate = date => {
      let currentStartTime = totalEventStartTime;
      for (let slot = 0; slot < numSlotsPerCounter; slot++) {
        const slotStartTime = formatTime(currentStartTime);
        const slotEndTime = formatTime(currentStartTime + sessionDuration);

        timeslots.push({
          date: formatDate(date), // Format the date as 'DD-MM-YYYY'
          time: `${slotStartTime} - ${slotEndTime}`,
        });

        currentStartTime += sessionDuration; // Move to the next slot
      }
    };

    const getDatesInRange = (startDate, endDate) => {
      const start = parseDate(startDate);
      const end = parseDate(endDate);
      const dates = [];
      while (start <= end) {
        dates.push(new Date(start)); // Store date objects
        start.setDate(start.getDate() + 1); // Move to the next day
      }
      return dates;
    };

    const allDates = getDatesInRange(eventDate, endDate);
    allDates.forEach(generateTimeslotsForDate);
    console.log(timeslots);
  }

  return timeslots;
};

//---------------------------------------------------------------------



exports.createEvent = async (req, res) => {
  try {
    const {
      eventType,
      eventName,
      eventDate,
      description,
      images,
      paymentCollection,
      startTime,
      endTime,
      endDate,
      maxRegistrations,
      paymentMethod,
      customFields,
      numCounters,
      maxParticipationPerCounter,
      sessionTimePerCounterHours,
      sessionTimePerCounterMinutes,
      amount,
      key,
      secret,
      Whowillbepresent,
      Instrumenttobecarried,
      by,
      status,
      scanner,
      optimistic,
      Associationwith,
      ContactPersonName,
      ContactPersonPhoneNumber,
      PlaceofEvent,
      eventownerlogo,
      patnerlog,
      emailConfig,
      instance_id,
    } = req.body;
    console.log(
      eventType,
      eventName,
      eventDate,
      description,
      images,
      paymentCollection,
      startTime,
      endTime,
      endDate,
      maxRegistrations,
      paymentMethod,
      customFields,
      numCounters,
      maxParticipationPerCounter,
      sessionTimePerCounterHours,
      sessionTimePerCounterMinutes,
      amount,
      key,
      secret,
      Whowillbepresent,
      Instrumenttobecarried,
      by,
      status,
      scanner,
      optimistic,
      Associationwith,
      ContactPersonName,
      ContactPersonPhoneNumber,
      PlaceofEvent,
      eventownerlogo,
      patnerlog,
      emailConfig,
      instance_id
    );
    console.log("scanner->", scanner, "opto->", optimistic);
    const clientId = req.params.id; // Extract clientId from req.params

    const eventOwnerLogoPath = eventownerlogo
      ? formatImageUrl(eventownerlogo)
      : null;
    const partnerLogPath = patnerlog ? formatImageUrl(patnerlog) : null;

    // Create new event
    const newEvent = new Event({
      clientId,
      eventType,
      eventName,
      eventDate,
      description,
      images,
      paymentCollection,
      startTime,
      endTime,
      endDate,
      maxRegistrations,
      paymentMethod,
      customFields,
      numCounters,
      maxParticipationPerCounter,
      sessionTimePerCounterHours,
      sessionTimePerCounterMinutes,
      amount,
      key,
      secret,
      Whowillbepresent,
      Instrumenttobecarried,
      by,
      status,
      Associationwith,
      ContactPersonName,
      ContactPersonPhoneNumber,
      PlaceofEvent,
      scanner,
      optimistic,
      eventownerlogo: eventOwnerLogoPath,
      patnerlog: partnerLogPath,
      emailConfig,
      instance_id,
      timeslot: [], // Initialize timeslot as empty
    });

    await newEvent.save();

    // Generate the URL based on eventType
    newEvent.url =
      eventType === "0"
        ? `http://localhost:5001/normalEvent/${newEvent._id}`
        : `http://localhost:5001/eventTimeSlot/${newEvent._id}`;

    await newEvent.save();

    //max participants per slots
    const maxParticipantsPerSolts = maxParticipationPerCounter * numCounters;

    // Handle eventType '1' to calculate timeslots
    if (eventType === "1" || eventType === "2") {

      const sessionDuration = sessionTimePerCounterHours * 60 + sessionTimePerCounterMinutes;


      // const timeslots = generateTimeslots(
      //   startTime,
      //   endTime,
      //   sessionDuration,
      //   eventDate,
      //   endDate
      // );

      // Generating time slots
      const timeslots = generateTimeSlots(startTime, endTime, sessionDuration, eventDate, endDate);
      console.log("timeslots : ", timeslots);

      // Map timeslots to database entries
      const slotPromises = timeslots.map((slot) => {
        // Convert to Asia/Kolkata time zone
        const startDate = moment.tz(slot.startTime, "Asia/Kolkata").toDate();
        const endDate = moment.tz(slot.endTime, "Asia/Kolkata").toDate();

        const slotDate = moment.tz(slot.startTime, "Asia/Kolkata").format("YYYY-MM-DD");
    
        console.log("dateTime: ", startDate, " ", endDate);
    
        // Ensure the start and end time are valid Date objects
        return Slot.create({
          eventId: newEvent._id,
          startTime: startDate, // Use Date objects directly
          endTime: endDate,     // Use Date objects directly
          slotDate: slotDate, 
          maxParticipants: maxParticipantsPerSolts,
          registeredUsers: [],
        });
      });


      newEvent.timeslot = timeslots;
      // Calculate maxRegistrations safely
      // if (
      //   numCounters &&
      //   !isNaN(numCounters) &&
      //   timeslots &&
      //   Array.isArray(timeslots) &&
      //   timeslots.length > 0 &&
      //   maxParticipationPerCounter &&
      //   !isNaN(maxParticipationPerCounter)
      // ) {
      //   newEvent.maxRegistrations =
      //     numCounters * timeslots.length * maxParticipationPerCounter;
      // } else {
      //   // Set maxRegistrations to 0 or handle as needed
      //   newEvent.maxRegistrations = 0; // Or omit this line if you don't want to save it at all
      // }

      await Promise.all(slotPromises);

      console.log("Timeslots successfully created and saved.")

      // await newEvent.save();
    }
    const emailconfiguration = newEvent.emailConfig;
    const config = await EmailConfig.findById(emailconfiguration);
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });

    // Asynchronously handle notifications
    handleNotifications(
      newEvent,
      config,
      eventType,
      sessionTimePerCounterHours,
      sessionTimePerCounterMinutes,
      Whowillbepresent,
      scanner,
      optimistic
    );
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event", error });
  }
};



// ----------------------------------------API to get slots by Event Id------------------------------
exports.getSlotsbyEventId = async (req, res) => {
  try{
    const eventId = req.params.eventid;

    const events = await Event.find({
      eventId,
      status: { $in: ["approved", "disapproved"] },
    });

    if(!events){
      return res.status(404).json({
        message: "Event not found",
      })
    }

    const timeSlots = await Slot.find({
      eventId: eventId,
    });
    
    if(!timeSlots){
      return res.status(404).json({
        message: "No time slots found by the give event id.",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Slot fetched successfuly",
      timeSlots: timeSlots
    });


  }catch(error){
    console.error("Internal server error, Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    })
  }
}





// Function to handle notifications in the background
async function handleNotifications(
  event,
  config,
  eventType,
  sessionTimePerCounterHours,
  sessionTimePerCounterMinutes,
  Whowillbepresent,
  scanner,
  optimistic
) {
  try {
    if (eventType === "2") {
      // Send emails to scanner
      if (scanner && scanner.length > 0) {
        for (const scannerId of scanner) {
          const scannerRole = await Role.findById(scannerId);
          if (scannerRole) {
            const emailText = `Dear ${scannerRole.Name},\n\nYou have been assigned to be part of the ${event.eventName} on ${event.eventDate} at ${event.PlaceofEvent}.`;
            await sendEmail(
              scannerRole.Email,
              `Assignment for ${event.eventName}`,
              emailText,
              config
            );
            console.log(
              `Email sent to scanner ${scannerRole.Name} (${scannerRole.Email})`
            );
          }
        }
      }

      // Send emails to Whowillbepresent
      if (Whowillbepresent && Whowillbepresent.length > 0) {
        for (const person of Whowillbepresent) {
          const { name, email } = person;
          const emailText = `Dear ${name},\n\nWe are pleased to inform you about your invitation to the event: ${event.eventName}.\nYou have been assigned to be part of the event on ${event.eventDate} at ${event.PlaceofEvent}.`;
          await sendEmail(
            email,
            `Event Details for ${event.eventName}`,
            emailText,
            config
          );
          console.log(`Email sent to ${name} (${email})`);
        }
      }

      // Send emails to optimistic roles
      if (optimistic && optimistic.length > 0) {
        for (const optimisticId of optimistic) {
          const optimisticRole = await Role.findById(optimisticId);
          if (optimisticRole) {
            const emailText = `Dear ${optimisticRole.Name},\n\nYou have been assigned to be part of the ${event.eventName} on ${event.eventDate} at ${event.PlaceofEvent}.`;
            await sendEmail(
              optimisticRole.Email,
              `Assignment for ${event.eventName}`,
              emailText,
              config
            );
            console.log(
              `Email sent to optimistic ${optimisticRole.Name} (${optimisticRole.Email})`
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in handleNotifications:", error);
  }
}

// const formatImageUrl = imageUrl => {
//   // Check if the URL is valid
//   if (
//     !imageUrl ||
//     typeof imageUrl !== "string" ||
//     !imageUrl.startsWith("http")
//   ) {
//     throw new Error("Invalid image URL provided");
//   }

//   // Replace the domain with the desired relative path format
//   const relativePath = imageUrl.replace("http://localhost:5001/", "./");

//   return relativePath; // Return the formatted URL
// };

const formatImageUrl = imageUrl => {
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("Invalid image URL provided:", imageUrl);
    return null;
  }

  if (imageUrl.startsWith("./public/uploads/") || imageUrl.startsWith("./")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("http")) {
    try {
      const url = new URL(imageUrl);
      return `.${url.pathname}${url.search}${url.hash}`;
    } catch (error) {
      console.error("Error formatting image URL:", error);
      return null;
    }
  }

  console.warn("Unrecognized image URL format:", imageUrl);
  return null;
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const clientId = req.params.id; // Extract clientId from req.params

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    // Find events that match the clientId with either approved or disapproved status
    const events = await Event.find({
      clientId,
      status: { $in: ["approved", "disapproved"] },
    });

    // If no events found, respond with a 404 status
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this client." });
    }

    // Respond with the found events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to retrieve events", error: error.message });
  }
};
exports.getEventsbysalesandmarketing = async (req, res) => {
  try {
    const clientId = req.params.id; // Extract clientId from req.params

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    // Find events that match the clientId with either approved or disapproved status
    const events = await Event.find({ by: clientId });

    // If no events found, respond with a 404 status
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this client." });
    }

    // Respond with the found events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to retrieve events", error: error.message });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve event", error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log("Attempting to update event with ID:", eventId);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    console.log("MongoDB connection status:", mongoose.connection.readyState);

    const existingEvent = await Event.findById(eventId);
    console.log("Existing event:", existingEvent);

    if (!existingEvent) {
      console.log("Event not found with ID:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Existing event found. Preparing update data...");
    const updateData = { ...req.body };

    // Handle image URLs
    if (updateData.eventownerlogo) {
      updateData.eventownerlogo =
        formatImageUrl(updateData.eventownerlogo) || updateData.eventownerlogo;
    }
    if (updateData.patnerlog) {
      updateData.patnerlog =
        formatImageUrl(updateData.patnerlog) || updateData.patnerlog;
    }

    console.log("Update data prepared:", JSON.stringify(updateData, null, 2));

    // Check if time-related fields have changed
    const timeFieldsChanged = [
      "startTime",
      "endTime",
      "eventDate",
      "endDate",
      "sessionTimePerCounterHours",
      "sessionTimePerCounterMinutes",
    ].some(
      field =>
        updateData[field] !== undefined &&
        updateData[field] !== existingEvent[field]
    );

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });
    console.log("Updated event result:", updatedEvent);

    if (!updatedEvent) {
      console.log("Failed to update event with ID:", eventId);
      return res.status(500).json({ message: "Failed to update event" });
    }

    // Handle timeslots if necessary
    if (
      (updateData.eventType === "1" || updateData.eventType === "2") &&
      timeFieldsChanged
    ) {
      console.log("Handling timeslots for event type:", updateData.eventType);
      const sessionDuration =
        (updatedEvent.sessionTimePerCounterHours || 0) * 60 +
        (updatedEvent.sessionTimePerCounterMinutes || 0);

      console.log("Generating timeslots...");
      const timeslots = generateTimeslot(
        updatedEvent.startTime,
        updatedEvent.endTime,
        sessionDuration,
        updatedEvent.eventDate,
        updatedEvent.endDate
      );
      console.log("Generated timeslots:", timeslots);

      updatedEvent.timeslot = timeslots;

      // Recalculate maxRegistrations
      if (
        updatedEvent.numCounters &&
        timeslots.length > 0 &&
        updatedEvent.maxParticipationPerCounter
      ) {
        updatedEvent.maxRegistrations =
          updatedEvent.numCounters *
          timeslots.length *
          updatedEvent.maxParticipationPerCounter;
        console.log(
          "Recalculated maxRegistrations:",
          updatedEvent.maxRegistrations
        );
      }

      console.log("Saving updated event with timeslots...");
      await updatedEvent.save();

      // Resend notifications if time-related fields have changed
      await handleNotifications(
        updatedEvent,
        await EmailConfig.findById(updatedEvent.emailConfig),
        updatedEvent.eventType,
        updatedEvent.sessionTimePerCounterHours,
        updatedEvent.sessionTimePerCounterMinutes,
        updatedEvent.Whowillbepresent,
        updatedEvent.scanner,
        updatedEvent.optimistic
      );
    }

    console.log("Event updated successfully:", updatedEvent._id);
    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};

async function handleNotifications(
  event,
  config,
  eventType,
  sessionTimePerCounterHours,
  sessionTimePerCounterMinutes,
  Whowillbepresent,
  scanner,
  optimistic
) {
  try {
    if (eventType === "2") {
      // Send emails to scanner
      if (scanner && scanner.length > 0) {
        for (const scannerId of scanner) {
          const scannerRole = await Role.findById(scannerId);
          if (scannerRole) {
            const emailText = `Dear ${scannerRole.Name},\n\nYou have been assigned to be part of the ${event.eventName} on ${event.eventDate} at ${event.PlaceofEvent}. Please note that there have been updates to the event details.`;
            await sendEmail(
              scannerRole.Email,
              `Updated Assignment for ${event.eventName}`,
              emailText,
              config
            );
            console.log(
              `Update email sent to scanner ${scannerRole.Name} (${scannerRole.Email})`
            );
          }
        }
      }

      // Send emails to Whowillbepresent
      if (Whowillbepresent && Whowillbepresent.length > 0) {
        for (const person of Whowillbepresent) {
          const { name, email } = person;
          const emailText = `Dear ${name},\n\nWe are writing to inform you about updates to the event: ${event.eventName}.\nThe event is scheduled for ${event.eventDate} at ${event.PlaceofEvent}. Please review the updated details.`;
          await sendEmail(
            email,
            `Updated Event Details for ${event.eventName}`,
            emailText,
            config
          );
          console.log(`Update email sent to ${name} (${email})`);
        }
      }

      // Send emails to optimistic roles
      if (optimistic && optimistic.length > 0) {
        for (const optimisticId of optimistic) {
          const optimisticRole = await Role.findById(optimisticId);
          if (optimisticRole) {
            const emailText = `Dear ${optimisticRole.Name},\n\nThere have been updates to the event ${event.eventName} scheduled for ${event.eventDate} at ${event.PlaceofEvent}. Please review the latest information.`;
            await sendEmail(
              optimisticRole.Email,
              `Updated Assignment for ${event.eventName}`,
              emailText,
              config
            );
            console.log(
              `Update email sent to optimistic ${optimisticRole.Name} (${optimisticRole.Email})`
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in handleNotifications:", error);
  }
}

// Updated generateTimeslot function without ObjectId
function generateTimeslot(
  startTime,
  endTime,
  sessionDuration,
  eventDate,
  endDate
) {
  const timeslots = [];

  // Convert eventDate and endDate to Date objects
  let currentDate = new Date(eventDate.split("-").reverse().join("-")); // format as YYYY-MM-DD
  const lastDate = new Date(endDate.split("-").reverse().join("-")); // format as YYYY-MM-DD

  // Loop over each day within the event date range
  while (currentDate <= lastDate) {
    // Set the start and end time for the current day
    let currentStartTime = new Date(currentDate);
    currentStartTime.setHours(...startTime.split(":").map(Number));

    const endTimeDate = new Date(currentDate);
    endTimeDate.setHours(...endTime.split(":").map(Number));

    // Generate timeslots for each day within the time window
    while (currentStartTime < endTimeDate) {
      const currentEndTime = new Date(
        currentStartTime.getTime() + sessionDuration * 60000
      ); // sessionDuration in minutes

      if (currentEndTime > endTimeDate) break;

      // Add the timeslot with formatted date and time
      timeslots.push({
        date: formatDate(currentDate),
        time: `${formatTime(currentStartTime)} - ${formatTime(currentEndTime)}`,
      });

      // Move start time to the end of the current slot
      currentStartTime = currentEndTime;
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return timeslots;
}

// Helper function to format date in dd-mm-yyyy format
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper function to format time in hh:mm format
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const result = await Event.deleteMany({});
    console.log(`Deleted ${result.deletedCount} events`);
    res.status(200).json({
      message: `Deleted ${result.deletedCount} events`,
    });
  } catch (error) {
    console.error("Error deleting events:", error);
    res.status(500).json({
      error: "Failed to delete events",
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const currentDateTime = new Date();

    // Filter timeslots for future times in memory
    let availableTimeslots = event.timeslot.filter(slot => {
      const [day, month, year] = slot.date.split("-");
      const startTime = slot.time.split(" - ")[0];
      const slotDateTime = new Date(`${year}-${month}-${day}T${startTime}`);
      return slotDateTime >= currentDateTime;
    });

    if (event.eventType === "1" || event.eventType === "2") {
      const validTimeslots = await Promise.all(
        availableTimeslots.map(async slot => {
          const existingRegistrationsInSlot = await Registration.countDocuments(
            {
              eventId,
              "participantFields.fieldName": "timeslot",
              "participantFields.fieldValue": `${slot.date} ${slot.time}`,
            }
          );
          console.log(existingRegistrationsInSlot);
          if (
            existingRegistrationsInSlot <
            event.maxParticipationPerCounter * event.numCounters
          ) {
            return slot;
          }
        })
      );

      // Filter out any undefined slots that didn't meet the criteria
      availableTimeslots = validTimeslots.filter(Boolean);
    }

    res.status(200).json({
      message: "Event retrieved successfully",
      event: {
        ...event.toObject(),
        availableTimeslots,
      },
    });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve event", error: error.message });
  }
};

exports.getEventsbysales = async (req, res) => {
  try {
    const clientId = req.params.id; // Extract clientId from req.params

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    // Find events that match the clientId with approved status
    const events = await Event.find({ clientId, status: "pending" });

    // If no events found, respond with a 404 status
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No approved events found for this client." });
    }

    // Respond with the found events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to retrieve events", error: error.message });
  }
};

exports.getEventsbypatner = async (req, res) => {
  try {
    const clientId = req.params.id; // Extract clientId from req.params

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    // Find events that match the clientId with approved status
    const events = await Event.find({ Associationwith: clientId });

    // If no events found, respond with a 404 status
    if (events.length === 0) {
      return res.status(404).json({ message: "No  events found " });
    }

    // Respond with the found events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to retrieve events", error: error.message });
  }
};

exports.getAllEventsByScanner = async (req, res) => {
  const { scannerId } = req.params; // Scanner ID from request parameters
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0"); // Add leading zero if day is single digit
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add leading zero if month is single digit
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  try {
    // Query the database for events associated with the given scannerId and a valid endDate
    const events = await Event.find({
      scanner: scannerId, // Find events where the scanner ID is included in the scanner array
      endDate: { $gte: formattedDate }, // Filter events where the endDate is today or later
    }).sort({
      endDate: 1, // Sort by endDate in ascending order (earliest date first)
    });

    // If no events are found, return a 404 error
    if (events.length === 0) {
      return res.status(404).send("No events found for this scanner.");
    }

    // Return the list of events if found
    return res.status(200).json(events);
  } catch (error) {
    // If an error occurs, log it and return a 500 server error
    console.error("Error fetching events by scanner:", error);
    res.status(500).send("Server error.");
  }
};

exports.getAllEventsByOptimistic = async (req, res) => {
  const { optimisticId } = req.params; // Optimistic ID from request parameters
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0"); // Add leading zero if day is single digit
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add leading zero if month is single digit
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  try {
    const events = await Event.find({
      optimistic: { $in: [optimisticId] }, // Check if optimisticId is in the optimistic array
      endDate: { $gte: formattedDate }, // Only get events where endDate is today or later
    }).sort({
      endDate: 1, // Sort in ascending order (earliest date first)
    });

    if (events.length === 0) {
      return res.status(404).send("No events found for this optimistic user.");
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events by optimistic user:", error);
    res.status(500).send("Server error.");
  }
};

exports.createOrUpdateEventEmail = async (req, res) => {
  const eventId = req.params.id; // Get eventId from params
  const { emailSubject, emailHtml } = req.body; // Destructure input from the request body

  try {
    let event;

    if (eventId) {
      // Find and update existing event
      event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Update the existing event with emailConfig, emailSubject, and emailHtml

      event.emailSubject = emailSubject;

      // Wrap the emailHtml in HTML format, replacing newlines with <br>
      event.emailHtml = `<p>${emailHtml.replace(/\n/g, "<br>")}</p>`;
      await event.save();
    } else {
      // Handle creation of a new event if eventId is not provided
      event = new Event({
        emailConfig,
        emailSubject,
        emailHtml: `<p>${emailHtml.replace(/\n/g, "<br>")}</p>`, // Wrap content in HTML
        // Add other necessary fields here
      });
      await event.save();
    }

    res
      .status(200)
      .json({ message: "Event email details saved successfully!", event });
  } catch (error) {
    console.error("Error saving event email details:", error);
    res
      .status(500)
      .json({ message: "Error saving event email details", error });
  }
};

exports.getEventEmail = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Return only the email-related fields
    const emailDetails = {
      emailSubject: event.emailSubject,
      emailHtml: event.emailHtml,
    };

    res.status(200).json(emailDetails);
  } catch (error) {
    console.error("Error retrieving event email details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving event email details", error });
  }
};
