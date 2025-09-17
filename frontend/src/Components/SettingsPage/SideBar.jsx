import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import "../HomePage/HomePage.css";

const SideBar = () => {//nome da cambiare pk non rappresenta piu una barra laterale
    const location = useLocation();
    
    // just for now
    const userType = localStorage.getItem("userType"); 
    const homeLink = userType == "Patient" ? "/patient-overview" : "/overview";

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
            <div className="account-header">
                <div className="logo-container">
                    <img src="images/logo.svg" className="logo-img" />
                    <div className="logo-text-scrolled">Hosportal</div>
                    <Link to={homeLink}><button className="account-home-btn">Home</button></Link>
                </div>
                {location.pathname === "/settings" ? (
                    <Link to="/account">
                        <button className="account-settings-btn">
                            <img src="images/logInIcon.svg" alt="Account" />
                        </button>
                    </Link>
                ) : (
                    <Link to="/settings">
                        <button className="account-settings-btn">
                            <img src="images/settingsIcon.svg" alt="Settings" />
                        </button>
                    </Link>
                )}
                <Link to="/" onClick={handleLogout}>
                    <button className="account-logout-btn">Log Out
                        <img src="images/lightLogOutIcon.svg"></img>
                    </button>
                </Link>
            </div>
        </>
    );
};

export default SideBar;
