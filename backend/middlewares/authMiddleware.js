const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // you can store user info on req.user
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

module.exports = authMiddleware;
