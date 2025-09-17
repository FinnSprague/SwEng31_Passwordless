import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../SettingsPage/SettingsPage.css";
import DashboardSideBar from "./DashboardSideBar";
import "./PatientsPage.css";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "", age: "", gender: "", diagnosis: ""
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/get-patients", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch patients");
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleNewInput = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const addPatient = async () => {
    const { name, age, gender, diagnosis } = newPatient;
    if (!name || !age || !gender || !diagnosis) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch("/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newPatient)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add patient");

      alert("Patient added!");
      setNewPatient({ name: "", age: "", gender: "", diagnosis: "" });
      setShowAddModal(false);
      fetchPatients();
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error adding patient");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    if (isMobile) setShowAddModal(true);
  };

  return (
    <>
      <DashboardSideBar />
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

      <div className="table-container">
        <h2 className="table-title">Patients</h2>

        {isMobile && (
          <div className="mobile-controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-patient-mobile" onClick={handleAddClick}>
              Add Patient
            </button>
          </div>
        )}

        {!isMobile && (
          <>
            <input
              type="text"
              className="search-input"
              placeholder="Search patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="add-patient-form">
              <input type="text" name="name" placeholder="Full Name" value={newPatient.name} onChange={handleNewInput} />
              <input type="number" name="age" placeholder="Age" value={newPatient.age} onChange={handleNewInput} />
              <select name="gender" value={newPatient.gender} onChange={handleNewInput}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input type="text" name="diagnosis" placeholder="Diagnosis" value={newPatient.diagnosis} onChange={handleNewInput} />
              <button className="add-btn" onClick={addPatient}>Add</button>
            </div>
          </>
        )}

        <div className="patients-table-section">
          <table className="patients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, i) => (
                <tr key={patient._id || i}>
                  <td>{patient._id?.slice(-5) || i + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && isMobile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={newPatient.name} onChange={handleNewInput} />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" value={newPatient.age} onChange={handleNewInput} />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={newPatient.gender} onChange={handleNewInput}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="diagnosis">Diagnosis</label>
                <input type="text" id="diagnosis" name="diagnosis" value={newPatient.diagnosis} onChange={handleNewInput} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn" onClick={addPatient}>Save Patient</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientsPage;
