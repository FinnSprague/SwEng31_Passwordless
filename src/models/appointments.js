const mongoose = require("mongoose");

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
