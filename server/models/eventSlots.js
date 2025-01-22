const mongoose = require("mongoose");


const slotSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    slotDate: {
        type: Date,
        required: true,
     },
    maxParticipants: {
        type: Number,
        required: true,
    },
    countRegisteredParticipants: {
        type: Number,
        default: 0,
    },
    registeredUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Registration',
        default: [],
    },
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
)

const Slot = mongoose.model('eventSlots', slotSchema);

module.exports = Slot;