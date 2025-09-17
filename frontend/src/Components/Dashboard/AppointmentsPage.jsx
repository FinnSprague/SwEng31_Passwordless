import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, subDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DashboardSideBar from "./DashboardSideBar";
import "./AppointmentsPage.css";

const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    time: "",
    reason: ""
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 950);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load appointments from backend
  useEffect(() => {
    getAppointments();
  }, []);

  // Fetch appointments
  const getAppointments = async () => {
    try {
      const response = await fetch("/get-appointments", {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch appointments");

      setAppointments(result);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleNewInput = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const addAppointment = async () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.time || !newAppointment.reason) {
      alert("Please fill in all fields!");
      return;
    }

    const appointmentData = {
      ...newAppointment,
      date: formattedDate
    };

    try {
      const response = await fetch("/create-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Appointment creation failed");

      alert("Appointment created successfully!");
      setNewAppointment({ patientId: "", doctorId: "", time: "", reason: "" });
      setShowAddModal(false);
      getAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      format(new Date(appointment.date), "dd-MM-yyyy") === format(selectedDate, "dd-MM-yyyy")
  );

  return (
    <>
      <DashboardSideBar />
      <Link to="/settings">
        <button className="settings-btn">
          <img src="images/settingsIcon.svg" alt="settings" />
        </button>
      </Link>
      <button className="profile-btn" onClick={() => setShowOptions(!showOptions)}>
      <img src={localStorage.getItem("profileImage") || "images/lightProfile.svg"} alt="Profile" />
      </button>
      {showOptions && (
        <div className="profile-btn-options">
          <Link to="/account" className="item">Manage Account</Link>
          <Link to="/" className="item">Log Out</Link>
        </div>
      )}

      <div className="appointments-container">
        <h2 className="appointment-title">Appointments</h2>
        {isMobile && (
          <button className="add-appointment-btn" onClick={() => setShowAddModal(true)}>
            Add Appointment
          </button>
        )}

        <div className="appointments-content">
          <div className="left-section">
            <div className="datepicker-container">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={subDays(new Date(), 0)}
                inline
                calendarClassName="calendar"
                dayClassName={(date) =>
                  format(date, "dd-MM-yyyy") === format(selectedDate, "dd-MM-yyyy")
                    ? "selected-day"
                    : ""
                }
              />
            </div>

            <div className="appointments-list-container">
              <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, i) => (
                    <div className="appointment-card" key={i}>
                      <p><b>Patient ID:</b> {appointment.patientId || "Unknown"}</p>
                      <p><b>Doctor ID:</b> {appointment.doctorId || "Unknown"}</p>
                      <p><b>Time:</b> {appointment.time}</p>
                      <p><b>Reason:</b> {appointment.reason}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-appointments">No appointments for this day.</p>
                )}
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="right-section">
              <div className="add-appointment-form">
                <p className="add-appointment-title">Add appointment</p>
                <input
                  type="text"
                  name="patientId"
                  placeholder="Patient ID"
                  value={newAppointment.patientId}
                  onChange={handleNewInput}
                />
                <input
                  type="text"
                  name="doctorId"
                  placeholder="Doctor ID"
                  value={newAppointment.doctorId}
                  onChange={handleNewInput}
                />
                <input
                  type="time"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleNewInput}
                />
                <input
                  type="text"
                  name="reason"
                  placeholder="Reason"
                  value={newAppointment.reason}
                  onChange={handleNewInput}
                />
                <button className="add-appointment-btn" onClick={addAppointment}>Add</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && isMobile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Appointment</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={newAppointment.patientId}
                  onChange={handleNewInput}
                />
              </div>
              <div className="form-group">
                <label>Doctor ID</label>
                <input
                  type="text"
                  name="doctorId"
                  value={newAppointment.doctorId}
                  onChange={handleNewInput}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleNewInput}
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={newAppointment.reason}
                  onChange={handleNewInput}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn" onClick={addAppointment}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsPage;
