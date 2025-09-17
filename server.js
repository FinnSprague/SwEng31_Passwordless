const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin:  `${process.env.FRONTEND_HOST}`, credentials: true })); // Allow frontend access
app.use(express.static('src')); // Uncomment for Backend testing
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


// MongoDB Connection
// const MONGO_URI = process.env.MONGO_KEY || "mongodb://localhost:27017/mydatabase";
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch(err => {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   });

// API Routes
app.use("/", authRoutes); 

// Start Backend Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

/*

For issues with ports, run 
netstat -ano | finstr :<PORT>

then, 

taskkill /PID <LISTENING_ID> /F

*/

