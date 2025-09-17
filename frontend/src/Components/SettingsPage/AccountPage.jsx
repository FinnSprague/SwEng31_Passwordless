import React, { useState, useEffect } from "react";
import "./SettingsPage.css";
import SideBar from "./SideBar";

const AccountPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("Name Surname");
    const [dob, setDob] = useState("dd/mm/yyyy");
    const [phoneNum, setPhoneNum] = useState("phone number");
    const [email, setEmail] = useState("missing");
    const [userRole, setUserRole] = useState("missing");
    const [profileImage, setProfileImage] = useState("images/profile.svg");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/get-profile", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to load profile");

                const user = data.user;
                setFullName(user.fullName);
                setDob(user.dateOfBirth?.slice(0, 10));
                setPhoneNum(user.phoneNumber);
                setEmail(user.email || "missing");
                setUserRole(user.userType || "missing");
            } catch (err) {
                console.error("Failed to auto-load profile:", err);
                alert("Could not load profile");
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                localStorage.setItem("profileImage", reader.result); // Store imagein localStorage for now 
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    /*const handleImageChange = (e) => {
        const file = e.target.files[0];//takes first file selected
        if (file) {
            //if a file is selected, generates a temporary url and updates state of profileImage
            setProfileImage(URL.createObjectURL(file));
        }
    };
*/
    const handleEditClick = async () => {
        if (isEditing) {
            try {
                const res = await fetch("/update-profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        fullName,
                        dateOfBirth: dob,
                        phoneNumber: phoneNum
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Update failed");
                alert("Profile updated!");
            } catch (err) {
                console.error("Update failed:", err);
                alert("Failed to update profile");
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <>
            <SideBar />
                <div className="account-section">
                    <div className="title-line">
                        <h3>My Account</h3>
                        <button className="edit-btn" onClick={handleEditClick}>
                            {isEditing ? "Save" : "Edit"}
                        </button>
                    </div>
                    <div className="profile-and-info">
                        <img className="profile-img" src={profileImage} alt="profile" />
                        <button className="editProfile-btn">
                            <label htmlFor="ImageInput">
                                <img src="images/editProfileButton.svg" alt="edit" />
                            </label>
                        </button>
                        <input
                            type="file"
                            id="ImageInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <div className="personal-info">
                            <span>
                                <label>Full Name</label>
                                {isEditing ? (
                                    <input className="editable-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                ) : (
                                    <p>{fullName}</p>
                                )}
                            </span>
                            <span>
                                <label>Role</label>
                                <p>{userRole}</p>
                            </span>
                            <span>
                                <label>Date of Birth</label>
                                {isEditing ? (
                                    <input className="editable-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                                ) : (
                                    <p>{dob}</p>
                                )}
                            </span>
                            <span>
                                <label>Email address</label>
                                <p>{email}</p>
                            </span>
                            <span>
                                <label>Phone number</label>
                                {isEditing ? (
                                    <input className="editable-input" type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                                ) : (
                                    <p>{phoneNum}</p>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default AccountPage;
