const Patient = require("../models/patients");

// POST /patients - Add new patient
exports.addPatient = async (req, res) => {
  try {
    const { name, age, gender, diagnosis } = req.body;

    if (!name || !age || !gender || !diagnosis) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPatient = new Patient({ name, age, gender, diagnosis });
    await newPatient.save();

    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ message: "Server error" });s
  }
};

// GET /patients - Retrieve all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server error" });
  }
};