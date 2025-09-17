import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PatientAppointments.css";
//Appointment booking logic to revise cause idk who should be able to book (patient/doctor/nurse...)
const PatientAppointments = ({isOpen}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  
  // mock data
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      date: "05-04-2025",
      time: "10:00 AM",
      doctor: "Dr. Smith",
    },
    {
      date: "12-04-2025",
      time: "02:00 PM",
      doctor: "Dr. Lee",
    },
  ]);

  // Doctor options and their available slots 
  const doctors = [
    { name: "Dr. Smith" },
    { name: "Dr. Lee" },
    { name: "Dr. Harris" },
  ];

  // Doctor slots for different dates 
  const doctorSlots = {
    "Dr. Smith": {
      "05-04-2025": ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      "12-04-2025": ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    },
    "Dr. Lee": {
      "10-04-2025": ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      "15-04-2025": ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    },
    "Dr. Harris": {
      "17-04-2025": ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM"],
      "20-04-2025": ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    },
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedDate(""); // Reset date when doctor changes
    setAvailableSlots([]); // Reset available slots
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setAvailableSlots(doctorSlots[selectedDoctor][date] || []); // Set available slots for the selected date
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      alert("Please select a doctor, date, and time slot.");
      return;
    }

    // Create the new appointment object
    const newAppointment = {
      date: selectedDate,
      time: selectedSlot,
      doctor: selectedDoctor,
    };

    // Update the upcoming appointments state with the new appointment
    setUpcomingAppointments((prevAppointments) => [
      ...prevAppointments,
      newAppointment,
    ]);

    // Reset the form fields after booking
    setSelectedDoctor("");
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedSlot("");
  };

  return (
    <>
      <div className={isOpen ? "appointments-container-margin" : "appointments-container"}>
        <div className="top-buttons">
          <Link to="/settings">
            <button className="settings-btn">
              <img src="images/settingsIcon.svg" alt="Settings" />
            </button>
          </Link>
          <button
            className="profile-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            <img
              src={localStorage.getItem("profileImage") || "images/lightProfile.svg"}
              alt="Profile"
            />
          </button>
          {showOptions && (
            <div className="profile-btn-options">
              <Link to="/account" className="item">Manage Account</Link>
              <Link to="/" className="item">Log Out</Link>
            </div>
          )}
        </div>

        <div className="appointments-section">
          <div className="appointments-column book-appointment">
            <h2>Book an Appointment</h2>
            <div className="doctor-select-container">
              <label htmlFor="doctorSelect">Select Doctor</label>
              <select id="doctorSelect" value={selectedDoctor} onChange={handleDoctorChange}>
                <option value="">-- Choose a doctor --</option>
                {doctors.map((doctor) => (
                    <option value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
            </div>
            {selectedDoctor && (
              <div className="date-select-container">
                <label>Select Available Date</label>
                <div className="available-dates">
                  {Object.keys(doctorSlots[selectedDoctor] || {}).map((date, index) => (
                    <button
                      key={index}
                      className={`date-btn ${selectedDate === date ? "selected" : ""}`}
                      onClick={() => handleDateSelect(date)}>
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && (
              <div className="slots-select-container">
                <label>Select Time Slot</label>
                <div className="slots-list">
                  {availableSlots.length === 0 ? (
                    <p>No available slots for this doctor on this date.</p>
                  ) : (
                    availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                        onClick={() => handleSlotSelect(slot)}>
                        {slot}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <button
              className="book-appointment-btn"
              onClick={handleBookAppointment}
              disabled={!selectedSlot}>
              Book Appointment
            </button>
          </div>

          <div className="appointments-column upcoming-appointments">
            <h2>My Appointments</h2>
            <div className="appointments-list">
              {upcomingAppointments.length === 0 ? (
                <p>No upcoming appointments.</p>
              ) : (
                upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-card-patient">
                    <p><b>Date:</b> {appointment.date}</p>
                    <p><b>Time:</b> {appointment.time}</p>
                    <p><b>Doctor:</b> {appointment.doctor}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientAppointments;
