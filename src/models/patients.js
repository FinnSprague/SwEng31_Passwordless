const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  diagnosis: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);