const Event = require("../models/eventmodel");
const Registration = require("../models/registercustomer");
const EnquiryRegistration = require("../models/registerEnquiry");
const Slot = require("../models/eventSlots");


exports.registerUserEnquiry = async (req, res) => {
    try {
        const { eventId, name, phone, email, remarks, selectedTimeSlot } = req.body;

        // Check for maditary fields
        if (!name || !email || !phone) {
            return res.status(400).status({
                message: "Error : missing required fields",
            })
        }

        // destructure date and time
        // const { date, time } = selectedTimeSlot;

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        };



        // Handle the general event without time slot
        if (event.eventType === "0") {
            const countRegisteredUser = await Registration.countDocuments({
                eventId,
            });
            if (countRegisteredUser >= event.maxRegistrations) {
                return res.status(400).json({
                    message: "No slots available, Maximum registration reached for this event"
                });
            }
        } else if (event.eventType === "1" || event.eventType === "2") {           // Handle the events with time slot 
            // if (!selectedTimeSlot || !selectedTimeSlot.date || !selectedTimeSlot.time) {
            //     return res.status(400).json({
            //         message: "Please provide a valid timeslot with both date and time",
            //     });
            // }


            // Check for slots
            const eventSlots = await Slot.find({ eventId: eventId });

            const isSlotsFilled = eventSlots.every(
                slot => slot.registeredUsers.length >= slot.maxParticipants
            );

            if (!isSlotsFilled) {
                return res.status(400).json({
                    status: "error",
                    message: "There are open slots"
                })
            };



            // Need to check the time slot issue

            // if(!isTimeslotValid){
            //     return res.status(400).json({
            //         message: `Timeslot ${date} & ${time} is not available for this event`,
            //     });
            // }

            // Check if the maximum registration has reached for the selected timeslot
            // const countRegisteredUser = await Registration.countDocuments({
            //     eventId,
            //     "participantFields.fieldName": "timeslot",
            //     "participantFields.fieldValue": `${date} ${time}`,
            // });

            // if (countRegisteredUser >= event.maxParticipationPerCounter * event.numCounters) {
            //     return res.status(400).json({
            //         message: `No slots available, Maximum registration reached for this event & timeslot : ${date} ${time}`
            //     });
            // }
        }

        const newEnquiry = new EnquiryRegistration({
            eventId,
            name,
            email,
            phone,
            remarks,
            // selectedTimeSlot
        });

        await newEnquiry.save();


        res.status(200).json({
            status: "success",
            message: "Enquiry Registration successful",
            enquiry: newEnquiry
        });

    } catch (error) {
        console.error("Internal server error !, Error: ", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


// GET enquiry 

exports.getEnquiry = async (req, res) => {
    try {
        const { enquiryId, name, phone, email } = req.body;

        // Build query dynamically based on provided fields
        const query = {};
        if (enquiryId) query.enquiryId = enquiryId;
        if (name) query.name = name;
        if (phone) query.phone = phone;
        if (email) query.email = email;

        
        const enquiries = await EnquiryRegistration.find(query);

        // Check if no enquiries were found
        if (enquiries.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No enquiry found",
            });
        }


        res.status(200).json({
            status: "success",
            message: "Enquiry successfully fetched",
            data: enquiries
        })


    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}