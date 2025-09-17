import React from 'react'
import { Link } from 'react-router-dom'
import '../AuthForm/AuthForm.css'
import HomePage from '../HomePage/HomePage'

const LoginLinkPage = () => {

    return (
        <>
            <HomePage>
            </HomePage>
            <div className="auth-modal-overlay">
                <div className="auth-container">
                    <Link to="/" ><button className="close-btn">
                        <img src="images/lightCloseBar.svg"></img>
                    </button></Link>
                    <h2>Log In</h2>
                    <img src="images/magicLinkMail.svg" className="mail-img"></img>
                    <p className="link-message">We emailed a magic link to your email.<br></br>
                        Click on the link to log in.
                    </p>
                    <div className="signup-link">
                        <Link className="signup-link">Resend Link</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginLinkPage