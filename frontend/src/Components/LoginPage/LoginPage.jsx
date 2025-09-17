import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startAuthentication } from "@simplewebauthn/browser";
import "../AuthForm/AuthForm.css";
import AuthForm from "../AuthForm/AuthForm";
import HomePage from "../HomePage/HomePage";
import emailjs from "emailjs-com";

emailjs.init("2Spd3xMa1GcHjmRPv"); // Initialize EmailJS

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Redirect user to overview page if already logged in
    useEffect(() => {
        const checkIfLoggedIn = async () => {
            try {
                const res = await fetch("http://localhost:5000/check-auth", {
                  method: "GET",
                  credentials: "include"
                });
        
                const result = await res.json();
                // TODO - When implementing on actual frontend,
                // we should check result.user.role and redirect accordingly
                if (result.loggedIn) {
                    navigate("/patients");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            }
        };  
      
        checkIfLoggedIn();
      }, []);

    // Load email from sessionStorage
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // Save email to sessionStorage when updated
    useEffect(() => {
        if (email) sessionStorage.setItem("userEmail", email);
    }, [email]);

    const checkAccountExists = async (email) => {
        const response = await fetch(`/authentication?email=${email}`, { credentials: "include" });

        if (response.status === 404) {
            setErrorMessage("This email does not have an account. Please sign up first.");
            return false;
        }

        if (!response.ok) {
            setErrorMessage("Error checking account. Please try again.");
            return false;
        }

        setErrorMessage("");
        return true;
    };

    const handleMagicLinkLogin = async () => {
        try {
            const trimmedEmail = email.trim();
            if (!trimmedEmail) {
                setErrorMessage("Please enter your email.");
                return;
            }

            const accountExists = await checkAccountExists(trimmedEmail);
            if (!accountExists) return;

            const lastRequestTime = localStorage.getItem("LastMagicLinkRequest");
            const COOLDOWN_TIME = 30000;

            if (lastRequestTime) {
                const timeElapsed = Date.now() - Number(lastRequestTime);
                if (timeElapsed < COOLDOWN_TIME) {
                    setErrorMessage(`Please wait ${Math.ceil((COOLDOWN_TIME - timeElapsed) / 1000)} seconds before requesting another magic link.`);
                    return;
                }
            }

            localStorage.setItem("LastMagicLinkRequest", Date.now().toString());

            const response = await fetch(`/generate-magic-link?email=${trimmedEmail}`, { credentials: "include" });

            if (!response.ok) {
                throw new Error("Failed to generate magic link");
            }

            const { magicLinkURL } = await response.json();

            await emailjs.send("service_3ce86jc", "template_viqc7ln", {
                magicLinkURL,
                to_email: trimmedEmail,
            });

            console.log("Magic link sent successfully.");
            navigate("/magicLink");

        } catch (error) {
            setErrorMessage("Failed to send magic link. Please try again.");
            console.error("Magic Link error:", error);
        }
    };

    const handlePasskeyLogin = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            alert("Please enter your email to log in with passkey.");
            return;
        }

        try {
            const accountExists = await checkAccountExists(trimmedEmail);
            if (!accountExists) return;

            const response = await fetch(`/authentication?email=${trimmedEmail}`, { credentials: "include" });
            if (!response.ok) throw new Error("Authentication request failed");

            const options = await response.json();
            console.log("Authentication options:", options);

            const authJSON = await startAuthentication({ optionsJSON: options });
            console.log("Authentication response:", authJSON);

            const verifyResponse = await fetch("/verify-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authJSON),
                credentials: "include",
            });

            const verification = await verifyResponse.json();
            console.log("Verification result:", verification);

            if (verification.verified) {
                sessionStorage.setItem("userRole", verification.role);
                navigate("/patients", { state: { email: trimmedEmail } });
            } else {
                setErrorMessage("Authentication failed. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Passkey login failed. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <>
        <HomePage></HomePage>
            <AuthForm
                title="Log In"
                primaryButton="Continue with Magic Link"
                onPrimaryAction={handleMagicLinkLogin}
                secondaryButton="Log in with Passkey"
                onSecondaryAction={handlePasskeyLogin}
                showBottomText={true}
                showTextContainer={true}
                isSignupPage={false}
                email={email}
                setEmail={setEmail}
                errorMessage={errorMessage}
            />
            </>
        
    );
};

export default LoginPage;
