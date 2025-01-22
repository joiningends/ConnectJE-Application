const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, "Please provide the eventId"],
    },

    name: {
        type: String,
        required: [true, "Please provide the name"],
        maxLength: 30
    },

    email: {
        type: String,
        required: [true, "Please provide the email"],
        unique: [true, "Email already registered"],
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },

    phone: {
        type: String,
        required: [true, "Please provide the phone number"],
        unique: [true, "Phone number already registered"],
        match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"]
    },

    remarks: {
        type: String,
        maxLength: 100
    },

    // selectedTimeSlot: [
    //     {
    //         date: {
    //             type: String
    //         },
    //         time: {
    //             type: String
    //         }
    //     }
    // ],

    followup: {
        type: Boolean,
        default: false
    },

    followupBy: {
        type: String,
        default: null,
    },

    followupDate: {
        type: Date,
        default: null
    },

    nextFollowupDate: {
        type: Date,
        default: null
    },
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
);

enquirySchema.index({ eventId: 1 });  // Indexing for frequent lookup

const EnquiryRegistration = mongoose.model('Enquiry', enquirySchema);

module.exports = EnquiryRegistration;