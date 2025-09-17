import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './PatientOverview.css';

const PatientOverview = ({ isOpen }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setBannerVisible(true), 200); 
    }, []);

    const patientOverview = {
        name: "Daniel Thompson",
        dateOfBirth: "12-07-1985",
        gender: "Male",
        bloodType: "O+",
        emergencyContact: "Sarah Miller (Wife) - +353 87 123 4567",
        medicalRecordNumber: "MRN123456",
    };

    const healthData = {
        notifications: 2,
        numberOfAppointments: 5,
        pendingResults: 1,
    };

    const notifications = [
        { title: "Upcoming Appointment", date: "April 4, 2025", message: "Your next check-up is scheduled for April 7th." },
        { title: "Medication Reminder", date: "March 31, 2025", message: "Take your daily medication." },
    ];

    const appointments = [
        { date: "15/04/2025", time: "11:30 AM", doctor: "Dr. Lee", status: "Scheduled" },
        { date: "07/04/2025", time: "2:00 PM", doctor: "Dr. Johnson", status: "Upcoming" },
        { date: "20/03/2025", time: "10:00 AM", doctor: "Dr. Smith", status: "Completed" },
    ];

    const testResults = [
        { testName: "Blood Test", testDate: "April 02, 2025", status: "Normal" },
        { testName: "X-ray", testDate: "March 31, 2025", status: "Pending" },
    ];

    return (
        <>
           
            <div className={isOpen ? "dashboard-content-margin" : "dashboard-content"}>
                <div className={`banner ${bannerVisible ? 'show' : ''}`}>Welcome to the patient portal!</div>
                <div className="top-buttons">
                    <Link to="/settings">
                        <button className="settings-btn settings-btn-patient">
                            <img src="images/settingsIcon.svg" alt="Settings" />
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
                </div>

                <div className="dashboard-layout">
                    <div className="patient-overview-column">
                        <div className="patient-overview-card">
                            <h2>My Overview</h2>
                            <ul>
                                <li><b>Name:</b> {patientOverview.name}</li>
                                <li><b>Date of Birth:</b> {patientOverview.dateOfBirth}</li>
                                <li><b>Gender:</b> {patientOverview.gender}</li>
                                <li><b>Blood Type:</b> {patientOverview.bloodType}</li>
                                <li><b>Emergency Contact:</b> {patientOverview.emergencyContact}</li>
                                <li><b>Medical Record Number:</b> {patientOverview.medicalRecordNumber}</li>
                            </ul>
                        </div>

                        <div className="appointment-timeline">
                            <h2>Appointment Timeline</h2>
                            <ul>
                                {appointments.map((appt, index) => (
                                    <li key={index} className="appointment-item">
                                        <span className="appointment-date">{appt.date}<br></br> {appt.time}</span>
                                        <span className="appointment-doctor">{appt.doctor}</span>
                                        <span className={`appointment-status ${appt.status.toLowerCase()}`}>{appt.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="other-sections-column">
                        <div className="health-cards">
                            <div className="health-card">
                                <div className="health-card-icon overview-icon-total-patients">
                                </div>
                                <h3>{healthData.notifications}</h3>
                                <p>Unread notifications</p>
                            </div>
                            <div className="health-card">
                                <div className="health-card-icon overview-icon-appointments">
                                </div>
                                <h3>{healthData.numberOfAppointments}</h3>
                                <p>Total appointments</p>
                            </div>
                            <div className="health-card">
                                <div className="health-card-icon overview-icon-total-appointments">
                                </div>
                                <h3>{healthData.pendingResults}</h3>
                                <p>Pending results</p>
                            </div>
                        </div>
                        
                        <div className="test-results">
                            <h2>Test Results</h2>
                            <ul>
                                {testResults.map((test, index) => (
                                    <li key={index}>
                                        <span className="test-name">{test.testName}</span>
                                        <span className="test-date">{test.testDate}</span>
                                        <span className={`test-status ${test.status.toLowerCase()}`}>{test.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="notifications">
                            <h2>Notifications</h2>
                            <ul>
                                {notifications.map((notif, index) => (
                                    <li key={index}>
                                        <span className="notif-title">{notif.title}</span>
                                        <span className="notif-date">{notif.date}</span>
                                        <p>{notif.message}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientOverview;
