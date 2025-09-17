import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../AuthForm/AuthForm.css";
import AuthForm from "../AuthForm/AuthForm";
import HomePage from "../HomePage/HomePage";

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        const storedRole = sessionStorage.getItem("userRole");

        if (storedEmail) setEmail(storedEmail);
        if (storedRole) setUserType(storedRole);
    }, []);

    const handleSignup = () => {
        const trimmedEmail = email.trim();
        const trimmedRole = userType.trim().toLowerCase();

        if (trimmedEmail && trimmedRole) {
            sessionStorage.setItem("userEmail", trimmedEmail);
            sessionStorage.setItem("userRole", trimmedRole);
            navigate("/settings", { state: { email: trimmedEmail, role: trimmedRole } });
        } else {
            alert("Please enter your email and select a role.");
        }
    };

    return (
        <>
            <HomePage />
            <AuthForm
                title="Sign Up"
                primaryButton="Create Account"
                onPrimaryAction={handleSignup}
                secondaryButton="Log In"
                onSecondaryAction={() => navigate("/login")}
                showBottomText={false}
                showTextContainer={false}
                isSignupPage={true}
                email={email}
                setEmail={setEmail}
                userType={userType}
                setUserType={setUserType}
            />
        </>
    );
};

export default SignupPage;
