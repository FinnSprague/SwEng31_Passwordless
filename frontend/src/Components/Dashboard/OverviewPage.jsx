import React, { useState } from "react";
import { Link } from 'react-router-dom';
import DashboardSideBar from "./DashboardSideBar";
import './OverviewPage.css';

const OverviewPage = () => {
    const [showOptions, setShowOptions] = useState(false);

    const appointments = [
        { id: 1, patient: "Liam Bennett", time: "10:00", reason: "General Checkup" },
        { id: 2, patient: "Emma Carter", time: "11:30", reason: "Flu Symptoms" },
        { id: 3, patient: "Noah Thompson", time: "13:00", reason: "Back Pain" },
        { id: 4, patient: "Ava Mitchell", time: "14:30", reason: "Allergy Consultation" },
        { id: 5, patient: "William Scott", time: "16:00", reason: "Headache" },
    ];

    const diagnoses = [
        { id: 1, diagnosis: "Flu", completed: 30 },
        { id: 2, diagnosis: "Back Pain", completed: 15 },
        { id: 3, diagnosis: "General Checkup", completed: 60 },
        { id: 4, diagnosis: "Hypertension", completed: 5 },
        { id: 5, diagnosis: "Headache", completed: 35 },
    ];

    // Today's statistics
    const todayStats = {
        appointmentsToday: 8,
        completedToday: 3,
        upcomingToday: 5
    };

    // Weekly statistics
    const weeklyData = [
        { day: "Mon", appointments: 7 },
        { day: "Tue", appointments: 5 },
        { day: "Wed", appointments: 8 },
        { day: "Thu", appointments: 12 },
        { day: "Fri", appointments: 10 },
        { day: "Sat", appointments: 4 },
        { day: "Sun", appointments: 0 }
    ];

    return (
        <>
            <DashboardSideBar />
            <div className="dashboard-content">
                <div className="top-buttons">
                    <Link to="/settings">
                        <button className="settings-btn">
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

                <div className="overview-dashboard-grid">
                    {/* Stats Overview Section */}
                    <div className="overview-stats-section">
                        <h2 className="overview-section-title">Today's Overview</h2>
                        <div className="overview-stats-cards">
                            <div className="overview-stat-card">
                                <div className="overview-stat-icon overview-icon-total-patients"></div>
                                <div className="overview-stat-content">
                                    <h3>Total Patients</h3>
                                    <p className="overview-stat-number">100</p>
                                </div>
                            </div>
                            <div className="overview-stat-card">
                                <div className="overview-stat-icon overview-icon-appointments"></div>
                                <div className="overview-stat-content">
                                    <h3>Today's Appointments</h3>
                                    <p className="overview-stat-number">{todayStats.appointmentsToday}</p>
                                    <div className="overview-stat-details">
                                        <span className="overview-stat-completed">{todayStats.completedToday} completed</span>
                                        <span className="overview-stat-upcoming">{todayStats.upcomingToday} upcoming</span>
                                    </div>
                                </div>
                            </div>
                            <div className="overview-stat-card">
                                <div className="overview-stat-icon overview-icon-total-appointments"></div>
                                <div className="overview-stat-content">
                                    <h3>Total Appointments</h3>
                                    <p className="overview-stat-number">{appointments.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Overview Chart */}
                    <div className="overview-chart-section">
                        <h2 className="overview-section-title">Weekly Appointments</h2>
                        <div className="overview-chart">
                            {weeklyData.map((day) => (
                                <div key={day.day} className="overview-chart-bar-container">
                                    <div
                                        className="overview-chart-bar"
                                        style={{ height: `${(day.appointments / 12) * 100}%` }}
                                    ></div>
                                    <div className="overview-chart-label">{day.day}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Appointments Section */}
                    <div className="overview-appointments-section">
                        <div className="overview-section-header">
                            <h2 className="overview-section-title">Upcoming Appointments</h2>
                            <Link to="/appointments" className="overview-view-all">View All</Link>
                        </div>
                        <div className="overview-appointments-list">
                            {appointments.slice(0, 3).map((appointment) => (
                                <div key={appointment.id} className="overview-appointment-card">
                                    <div className="overview-appointment-time">{appointment.time}</div>
                                    <div className="overview-appointment-details">
                                        <h4 className="overview-patient-name">{appointment.patient}</h4>
                                        <p className="overview-appointment-reason">{appointment.reason}</p>
                                    </div>
                                    <div className="overview-appointment-actions">
                                        <button className="overview-button-view">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Diagnosis Section */}
                    <div className="overview-diagnosis-section">
                        <div className="overview-section-header">
                            <h2 className="overview-section-title">Confirmed Diagnoses</h2>
                        </div>
                        <div className="overview-diagnosis-list">
                            {diagnoses.slice(0, 3).map((diagnosis) => (
                                <div key={diagnosis.id} className="overview-diagnosis-card">
                                    <div className="overview-diagnosis-info">
                                        <h4 className="overview-diagnosis-name">{diagnosis.diagnosis}</h4>
                                        <p className="overview-diagnosis-count">{diagnosis.completed} diagnoses</p>
                                    </div>
                                    <div className="overview-progress-container">
                                        <div
                                            className="overview-progress-bar"
                                            style={{ width: `${diagnosis.completed}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OverviewPage;