const jwt = require("jsonwebtoken");

// Middleware to authenticate the user
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Invalid or missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or missing token" });
  }
};

// Middleware for Role-Based Access Control
exports.authoriseRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Unauthorised");
    }
    next();
  };
};