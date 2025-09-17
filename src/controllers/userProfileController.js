const User = require("../models/users");
const jwt = require("jsonwebtoken");

// GET /get-profile
exports.getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        if (!userId) {
            return res.status(400).json({ message: "Invalid token: userId missing" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return a normalized user object, but don't break structure
        const safeUser = {
            fullName: user.fullName || "Name Surname",
            dateOfBirth: user.dateOfBirth || "dd/mm/yyyy",
            phoneNumber: user.phoneNumber || "phone number",
            email: user.email || "missing",
            userType: user.role || "missing"
        };

        res.json({ user: safeUser });
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PATCH /update-profile
exports.updateProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const updates = {};
        const { fullName, dateOfBirth, phoneNumber } = req.body;
        if (fullName) updates.fullName = fullName;
        if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
        if (phoneNumber) updates.phoneNumber = phoneNumber;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).json({ message: "Server error" });
    }
};
