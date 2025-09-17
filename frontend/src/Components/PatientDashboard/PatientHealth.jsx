import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './PatientHealth.css';

const PatientHealth = ({ isOpen }) => {
    const [showOptions, setShowOptions] = useState(false);

    const healthData = {
        medications: [
            { name: "Aspirin", dosage: "100 mg", status: "Ongoing" },
            { name: "Metformin", dosage: "500 mg", status: "Ongoing" },
        ], 
        allergies: [
            { substance: "Penicillin", severity: "Moderate" },
        ], 
        lastVisit: "March 30, 2025", 
        nextVisit: "April 7, 2025", 
        medicalHistory: [
            { condition: "Type 2 Diabetes", diagnosisDate: "2024", status: "Under Control" },
            { condition: "Knee Surgery", diagnosisDate: "2020", status: "Recovered" },
        ], // Patient's medical history
    };

    return (
        <>
            <div className={isOpen ? "dashboard-content-margin" : "dashboard-content"}>
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

                <div className="health-summary">                  
                    {/* Medications Section */}
                    <div className="section medications-section">
                        <h3>Current Medications</h3>
                        <ul>
                            {healthData.medications.map((med, index) => (
                                <li key={index} className="medication-item">
                                    <strong>{med.name}</strong> - {med.dosage} ({med.status})
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Allergies Section */}
                    <div className="section allergies-section">
                        <h3>Allergies</h3>
                        <ul>
                            {healthData.allergies.map((allergy, index) => (
                                <li key={index} className="allergy-item">
                                    <strong>{allergy.substance}</strong> - Severity: {allergy.severity}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Medical History Section */}
                    <div className="section medical-history-section">
                        <h3>Medical History</h3>
                        <ul>
                            {healthData.medicalHistory.map((history, index) => (
                                <li key={index} className="medical-history-item">
                                    <strong>{history.condition}</strong> (Diagnosed: {history.diagnosisDate}) - Status: {history.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Visit Information Section */}
                    <div className="section visit-info">
                        <h3>Visit Information</h3>
                        <p><strong>Last Visit:</strong> {healthData.lastVisit}</p>
                        <p><strong>Next Visit:</strong> {healthData.nextVisit}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientHealth;
