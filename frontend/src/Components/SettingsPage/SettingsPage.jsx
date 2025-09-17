import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";
import "./SettingsPage.css";
import SideBar from "./SideBar";

const SettingsPage = () => {
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [selectedPasskeyId, setSelectedPasskeyId] = useState("");
    const [error, setError] = useState("");
    const [passkeys, setPasskeys] = useState([]);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        const userEmail = location.state?.email || storedEmail || "";
        setEmail(userEmail);

        fetchPasskeys();
    }, [location.state]);

    const fetchPasskeys = async () => {
        try {
            const response = await fetch("http://localhost:5000/get-passkeys", {
                credentials: "include",
            });
    
            if (!response.ok) throw new Error("Failed to fetch passkeys");
    
            const data = await response.json();
            setPasskeys(data.passkeys || []);
        } catch (error) {
            console.error("Error fetching passkeys:", error);
        }
    };

    // Replaced by fetchPasskeys
    // Fetch passkey status from backend
    /*
    const fetchPasskeyStatus = async (email) => {
        try {
            const response = await fetch(`${process.env.FRONTEND_HOST}/passkey-status?email=${email}`);
            if (!response.ok) throw new Error("Failed to fetch passkey status");

            const data = await response.json();
            setPasskeys(data.passkeys || []);
        } catch (error) {
            console.error("Error fetching passkey status:", error);
        }
    };
    */



    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        sessionStorage.setItem("userEmail", newEmail);
    };

    const deletePasskey = async () => {
        if (!selectedPasskeyId) {
            alert("Please select a passkey to delete.");
            return;
        }

        try {
            const res = await fetch(`/delete-passkey/${selectedPasskeyId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete passkey");

            alert("Passkey deleted successfully!");
            setSelectedPasskeyId("");
            fetchPasskeys();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Could not delete passkey.");
        }
    };

    const register = async () => {
        try {
            const emailTrimmed = email.trim();
            const userRole = sessionStorage.getItem("userRole"); // 
    
            if (!emailTrimmed) {
                setError("Email field is empty");
                return;
            }
    
            const initResponse = await fetch(`/register?email=${emailTrimmed}&role=${userRole}`, {
                credentials: "include",
                cache: "no-cache",
            });
    
            if (!initResponse.ok) throw new Error("Failed to initiate registration");
    
            const options = await initResponse.json();
            const regJSON = await startRegistration({ optionsJSON: options });

            const verResponse = await fetch("/verify-reg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(regJSON),
                credentials: "include",
            });
    
            const verificationJSON = await verResponse.json();
    
            if (verificationJSON.verified) {
                fetchPasskeys();
                setError("");
            } else {
                throw new Error("Verification failed");
            }
        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.message);
        }
    };

    return (
        <>
            <SideBar />
                <div className="passkey-section">
                    <h3>
                        <img src="images/key.svg" alt="key icon" /> Passkey
                    </h3>
                    <div className="passkey-info">
                        <div className="passkey-btns">
                            <button className="create-passkey-btn" onClick={register}>
                                Create passkey
                            </button>
                            <button className="delete-passkey-btn" onClick={deletePasskey}>
                                Delete selected passkey
                            </button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <table className="passkey-table">
                            <thead>
                                <tr>
                                    <th>Passkey</th>
                                    <th>Created</th>
                                    <th>Last Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {passkeys.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">No passkeys registered</td>
                                    </tr>
                                ) : (
                                    passkeys.map((passkey, index) => (
                                        <tr
                                            key={passkey.id}
                                            onClick={() => setSelectedPasskeyId(passkey.id)}
                                            style={{
                                                backgroundColor: selectedPasskeyId === passkey.id ? "#eef" : "transparent",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <td>{`Passkey ${index + 1}`}</td>
                                            <td>{new Date(passkey.createdAt).toLocaleString()}</td>
                                            <td>{passkey.lastUsed ? new Date(passkey.lastUsed).toLocaleString() : "N/A"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="email-section">
                    <h3>
                        <img src="images/mail.svg" alt="mail icon" /> Email
                    </h3>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                    />
                    <p className="email-display">Current email: {email || "No email provided"}</p>
                </div>

                <button className="delete-account-btn">Delete account</button>
        </>
    );
};

export default SettingsPage;
