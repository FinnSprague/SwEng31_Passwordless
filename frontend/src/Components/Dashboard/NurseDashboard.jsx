import React, { useState } from "react";
import { Link } from 'react-router-dom';
import DashboardSideBar from "./DashboardSideBar";
import './OverviewPage.css'; // reuse for layout/styling

const NurseDashboard = () => {
    const [showOptions, setShowOptions] = useState(false);

    const vitals = [
        { id: 1, patient: "Liam Bennett", temperature: "37.2°C", bp: "120/80", pulse: "72 bpm" },
        { id: 2, patient: "Emma Carter", temperature: "38.5°C", bp: "135/90", pulse: "89 bpm" },
        { id: 3, patient: "Noah Thompson", temperature: "36.8°C", bp: "118/78", pulse: "75 bpm" },
    ];

    const medicationQueue = [
        { id: 1, patient: "Ava Mitchell", time: "09:00", medication: "Paracetamol" },
        { id: 2, patient: "William Scott", time: "10:30", medication: "Amoxicillin" },
        { id: 3, patient: "Lucas Gray", time: "12:00", medication: "Insulin" },
    ];

    const shiftStats = {
        totalPatients: 14,
        medsGiven: 9,
        pendingMeds: 3,
    };

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
                        <img src="images/lightProfile.svg" alt="Profile" />
                    </button>
                    {showOptions && (
                        <div className="profile-btn-options">
                            <Link to="/account" className="item">Manage Account</Link>
                            <Link to="/" className="item">Log Out</Link>
                        </div>
                    )}
                </div>

                <div className="overview-dashboard-grid">
                    {/* Shift Overview */}
                    <div className="overview-stats-section">
                        <h2 className="overview-section-title">Shift Overview</h2>
                        <div className="overview-stats-cards">
                            <div className="overview-stat-card">
                                <div className="overview-stat-icon overview-icon-total-patients"></div>
                                <div className="overview-stat-content">
                                    <h3>Patients Assigned</h3>
                                    <p className="overview-stat-number">{shiftStats.totalPatients}</p>
                                </div>
                            </div>
                            <div className="overview-stat-card">
                                <div className="overview-stat-icon overview-icon-appointments"></div>
                                <div className="overview-stat-content">
                                    <h3>Medications</h3>
                                    <p className="overview-stat-number">{shiftStats.medsGiven} given</p>
                                    <div className="overview-stat-details">
                                        <span className="overview-stat-upcoming">{shiftStats.pendingMeds} pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medication Queue */}
                    <div className="overview-appointments-section">
                        <div className="overview-section-header">
                            <h2 className="overview-section-title">Medication Schedule</h2>
                        </div>
                        <div className="overview-appointments-list">
                            {medicationQueue.map((item) => (
                                <div key={item.id} className="overview-appointment-card">
                                    <div className="overview-appointment-time">{item.time}</div>
                                    <div className="overview-appointment-details">
                                        <h4 className="overview-patient-name">{item.patient}</h4>
                                        <p className="overview-appointment-reason">{item.medication}</p>
                                    </div>
                                    <div className="overview-appointment-actions">
                                        <button className="overview-button-view">Mark as Given</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vitals to Monitor */}
                    <div className="overview-diagnosis-section">
                        <div className="overview-section-header">
                            <h2 className="overview-section-title">Vital Signs</h2>
                        </div>
                        <div className="overview-diagnosis-list">
                            {vitals.map((vital) => (
                                <div key={vital.id} className="overview-diagnosis-card">
                                    <div className="overview-diagnosis-info">
                                        <h4 className="overview-diagnosis-name">{vital.patient}</h4>
                                        <p className="overview-diagnosis-count">
                                            Temp: {vital.temperature} | BP: {vital.bp} | Pulse: {vital.pulse}
                                        </p>
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

export default NurseDashboard;
