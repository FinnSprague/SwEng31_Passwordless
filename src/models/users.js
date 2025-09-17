const mongoose = require("mongoose");

// Passkey Schema
const PasskeySchema = new mongoose.Schema({
    id : {type : String, required : true, unique : true},
    publicKey: {type : Buffer, required : true, unique: true},
    webAuthnUserID: {type : String, required : true, unique: true },
    counter: {type : Number, required : true},
    deviceType: {type : String, required : true},
    backedUp : {type : Boolean, required : true},
    transports : {type : [String], required : true}
});

// User Schema
const UserSchema = new mongoose.Schema({
    email: {type : String, required : true, unique : true},
    passkeys: [PasskeySchema],
    fullName: {type: String},
    role: {
        type: String,
        enum: ['patient', 'doctor', 'nurse'],
        //required: true
    },
    dateOfBirth: {type: Date},
    phoneNumber: {type: String}
});

module.exports = mongoose.model("User", UserSchema)
module.exports = mongoose.model("User", UserSchema)
