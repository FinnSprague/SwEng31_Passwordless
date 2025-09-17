const mongoose = require("mongoose");

const MagicLinkSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 600 },
});

  
module.exports = mongoose.model("MagicLink", MagicLinkSchema);