const { randomBytes } = require("crypto");
const { generateRegistrationOptions, verifyRegistrationResponse } = require("@simplewebauthn/server");

const User = require("../models/users");
const MagicLink = require("../models/magicLink");

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Cool down time for generating magic link (30 seconds)
const COOLDOWN_TIME = 30000;

exports.generateMagicLink = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if a magic link for this email already exists
    const existingMagicLink = await MagicLink.findOne({ email });
    
    if (existingMagicLink) {
      const now = Date.now();
      const lastRequestTime = new Date(existingMagicLink.createdAt).getTime();

      // If the cool down has not passed, return an error
      if (now - lastRequestTime < COOLDOWN_TIME) {
        const remainingTime = Math.ceil((COOLDOWN_TIME - (now - lastRequestTime)) / 1000);
        return res.status(429).json({ message: `Please wait ${remainingTime} before requesting another magic link.` })
      }
    }

    const token = randomBytes(32).toString("hex");

    await MagicLink.findOneAndUpdate(
      { email },
      { token, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    const magicLinkURL = `${process.env.BACKEND_HOST}/magic-link?token=${token}`;
    console.log(magicLinkURL);

    res.json({ magicLinkURL });
  } catch (error) {
    console.error("Error generating magic link:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  
exports.handleMagicLink = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Invalid or missing token" });
    }

    // Find matching token in database
    const magicLink = await MagicLink.findOne({ token });

    if (!magicLink) {
      return res.status(400).json({ message: "Invalid or expired magic link" });
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: magicLink._id.toString(), email: magicLink.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the JWT in an HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 3600000  // 1 hour expiration
    });

    // Remove the magic link from the database so that the link is one-time use
    await MagicLink.deleteOne({ token });

    // Redirect to homepage.html for testing purposes
    return res.redirect("http://localhost:5173/patients");
  } catch (error) {
    console.error("Error in handleMagicLink:", error);
    res.status(500).json({ message: "Server error" })
  }
};