import React from "react";
import { Link } from "react-router-dom";
import "../SettingsPage/SettingsPage.css";
import "./PatientDashboardSideBar.css"

const PatientDashboardSideBar = ({ isOpen, setIsOpen }) => {

    return (
        <>
                <div className="patient-dashboard">
                    <div className="open-sidebar-patient">
                        <button className="open-sidebar-patient-btn" onClick={() => setIsOpen(true)}>
                            <img src="images/openBar.svg"></img>
                        </button>
                    </div>
                    <div
                        class="side-bar"
                        style={{
                            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                            transition: "transform 0.3s ease-in-out",
                        }}
                    >
                        <button className="close-sidebar-patient-btn" onClick={() => setIsOpen(false)}>
                            <img src="images/lightCloseBar.svg"></img>
                        </button>
                        <span>
                            <Link to="/patient-overview">
                                {/*keeps overview-btn class always into consideration*/}
                                <button className={`overview-btn ${location.pathname === "/patient-overview" ? "current" : ""}`}>
                                    <img src="images/dashboardIcon.svg"></img>Overview
                                </button>
                            </Link>
                        </span>
                        <span>
                            <Link to="/patient-health">
                                <button className={location.pathname == "/patient-health" ? "current" : ""}>
                                    <img src="images/logInIcon.svg"></img>Data
                                </button>
                            </Link>
                        </span>
                        <span>
                            <Link to="/patient-appointments">
                                <button className={location.pathname == "/patient-appointments" ? "current" : ""}>
                                    <img src="images/appointmentIcon.svg"></img>Appointments
                                </button>
                            </Link>
                        </span>
                        <span>
                            <Link to="/">
                                <button>
                                    <img src="images/lightLogOutIcon.svg"></img>Log out
                                </button>
                            </Link>
                        </span>
                    </div>
                </div>
        </>
    );
};

export default PatientDashboardSideBar;
