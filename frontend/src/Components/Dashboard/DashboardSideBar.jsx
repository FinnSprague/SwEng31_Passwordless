import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../SettingsPage/SettingsPage.css";
import "./DashboardSideBar.css"

const DashboardSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const location = useLocation();

    const navigate = useNavigate();
    
    const handleLogout = async (e) => {
      e.preventDefault();
      try {
        await fetch("http://localhost:5000/logout", {
          method: "POST",
          credentials: "include",
        });

        sessionStorage.clear();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    return (
        <>
            <div className="dashboard">
                <div className="open-sidebar">
                    <button className="open-sidebar-btn" onClick={toggleSidebar}>
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
                    <button className="close-sidebar-btn" onClick={toggleSidebar}>
                        <img src="images/lightCloseBar.svg"></img>
                    </button>
                    <span>
                        <Link to="/overview">
                            {/*keeps overview-btn class always into consideration*/}
                            <button className={`overview-btn ${location.pathname === "/overview" ? "current-page" : ""}`}>
                                <img src="images/dashboardIcon.svg"></img>Overview
                            </button>
                        </Link>
                    </span>
                    <span>
                        <Link to="/doc-patients">
                            <button className={location.pathname == "/patients" ? "current-page" : ""}>
                                <img src="images/logInIcon.svg"></img>Patients
                            </button>
                        </Link>
                    </span>
                    <span>
                        <Link to="/appointments">
                            <button className={location.pathname == "/appointments" ? "current-page" : ""}>
                                <img src="images/appointmentIcon.svg"></img>Appointments
                            </button>
                        </Link>
                    </span>
                    <span>
                        <Link to="/" onClick={handleLogout}>
                            <button>
                                <img src="images/lightLogOutIcon.svg"></img>Log Out
                            </button>
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
};

export default DashboardSideBar;
