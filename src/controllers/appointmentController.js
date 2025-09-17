const Appointment = require("../models/appointments");
const User = require("../models/users");
const Patient = require("../models/patients");

const jwt = require("jsonwebtoken");

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;

    // Code here to match names to id
    const patientMatch = await Patient.findOne({
	name: patientId,	
    });
    const doctorMatch = await User.findOne({
	fullName: doctorId,
	role: "doctor"
    });
    console.log(patientId);
    if (!patientMatch || !doctorMatch) {
	    return res.status(404).json({ message: "No patient or doctor was found with that name" });
    }
    const patientsId = patientMatch._id;
    const doctorsId = doctorMatch._id;

    if (!patientId || !doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for conflicts (i.e., doctor already has an appointment at the requested time)
    const conflict = await Appointment.findOne({
      doctor: doctorsId,
      date,
      time
    });

    if (conflict) {
      return res.status(409).json({
        message: "Doctor already has an appointment scheduled at this time."
      });
    }

    const appointment = new Appointment({
      patient: patientsId,
      doctor: doctorsId,
      date,
      time,
      description: reason
    });

    await appointment.save();
        
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userRole = "doctor";

    const { patientId, doctorId } = req.query;

    let filter = {};

    if (userRole === "doctor") {
      filter.doctor = doctorId || userId;
    } else if (userRole === "patient") {
      filter.patient = patientId || userId;
    } else if (userRole === "nurse") {
      if (doctorId) filter.doctor = doctorId;
      if (patientId) filter.patient = patientId;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const appointments = await Appointment.find(filter)
      .populate("doctor", "fullName email")
      .populate("patient", "fullName email");

    console.log(appointments);

    res.json(appointments);

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
