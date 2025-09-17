import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './HomePage.css';
import './AboutUs.css';

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const images = [
    "images/hospital1.svg",
    "images/hospital2.svg",
    "images/hospital3.svg",
  ];

  useEffect(() => {
    //Every 5 seconds, setInterval() increments currentIndex so that the image changes for the carousel
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);//index loops back to 0 after last image
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    //If user has scrolled past 50px we change the header background
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll); //when user scrolls this calls handleScroll function
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <header className={scrolled ? "header-scrolled" : "header"}>
        <div className="logo-container">
          <img src="images/logo.svg" className="logo-img" />
          <div className={scrolled ? "logo-text-scrolled" : "logo-text"}>Hosportal</div>
        </div>
        <Link to="/login"><button className="login-btn">Log In</button></Link>
      </header>
      {/* Welcome Section */}
      <section className="welcome-section">
        {/* Left side with Welcome text */}
        <div className="welcome-section-left">
          <h1>Welcome to our Hospital Portal</h1>
          <p>Access healthcare services with ease, connecting doctors, nurses, and patients efficiently.</p>
          <Link to="/signup"><button className="get-started-btn">Get Started</button></Link>

        </div>
        {/* Right side with the image carousel */}
        <div className="welcome-section-right">
          <div className="carousel-container">
            {images.map((image, index) => (
              <div
                key={index}
                className={index == currentIndex ? "carousel-slide-active" : "carousel-slide"}
              >
                <img src={image} className="carousel-image" />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <img src="images/doctor.svg" class="icon-image"></img>
          <h3>Doctors</h3>
          <p>Manage appointments, patient records, and communicate securely.</p>
        </div>
        <div className="feature-card">
          <img src="images/nurse.svg" class="icon-image"></img>
          <h3>Nurses</h3>
          <p>Track patient status, medications, and daily tasks efficiently.</p>
        </div>
        <div className="feature-card">
          <img src="images/patient.svg" class="icon-image"></img>
          <h3>Patients</h3>
          <p>Book appointments and view health records.</p>
        </div>
      </section>
      {/* About Us Section */}
      <section className="about-us-section">
        <div className="about-us-title">About Our Portal</div>
        <div className="about-us-text-card">
          <p>
            Our hospital portal is designed to streamline healthcare management, allowing seamless interaction
            between patients and medical professionals. We prioritize security, accessibility, and efficiency.
          </p>
        </div>
        <Link to="/signup"> <button className="get-started-btn">Join Us</button></Link>

      </section>
      <section>
        <div className="about-container">
          <div className="title-container">
            <h1>Passwordless <br></br> Authentication</h1>
          </div>
          <div className="text-card">
            <div className="content">
              <p className="heading">What are Passkeys?</p>
              <p className="para">
                A Passkey is a replacement for passwords that aim to provide a more convient and secure password-less authentication method. 
                Passkeys are far more secure and easier to use than both passwords and 2FA methods. 
              </p>
            </div>
          </div>
          <img src="images/homeKey.svg" class="key-image"></img>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Hosportal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
