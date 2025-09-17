import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = ({
    title,
    primaryButton,
    onPrimaryAction,
    secondaryButton,
    onSecondaryAction,
    showBottomText,
    showTextContainer,
    isSignupPage,
    email,
    setEmail,
    userType,
    setUserType,
    errorMessage,
}) => {
    const navigate = useNavigate();
    // Redirect user to overview page if already logged in
    useEffect(() => {
        const checkIfLoggedIn = async () => {
            try {
                const res = await fetch("http://localhost:5173/check-auth", {
                  method: "GET",
                  credentials: "include"
                });
        
                const result = await res.json();
                // TODO - When implementing on actual frontend,
                // we should check result.user.role and redirect accordingly
                if (result.loggedIn) {
                    navigate("/doc-patients");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            }
        };  
      
        checkIfLoggedIn();
    }, []);
    return (
        <div className="auth-modal-overlay">
            <div className="auth-container">
                <Link to="/" >
                    <button className="close-btn">
                        <img src="images/lightCloseBar.svg" alt="Close" />
                    </button>
                </Link>

                <h2>{title}</h2>

                <form id="login-form" onSubmit={(e) => {
                    e.preventDefault();
                    onPrimaryAction();
                    localStorage.setItem("userType", userType);//just for now
                }}>
                    <label>Enter email:</label>
                    <div className="input-container">
                        <Mail className="input-icon" size={15} />
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Show dropdown if signup page */}
                    {isSignupPage && (
                        <div className="dropdown-container">
                            <label>I am a...</label>
                            <select
                                id="userType"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Patient">Patient</option>
                            </select>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="primary-btn">{primaryButton}</button>

                    <div className="or-line">
                        <div className="line"></div>
                        <span>Or</span>
                        <div className="line"></div>
                    </div>

                    <button type="button" className="secondary-btn" onClick={onSecondaryAction}>
                        {secondaryButton}
                    </button>

                    {showBottomText && (
                        <p className="alt-text">
                            Don't have an account yet? <Link to="/signup" className="signup-link">Sign Up</Link>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
