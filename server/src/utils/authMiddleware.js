import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT and check admin type
const authMiddleware = (requiredAdminType) => async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Verify admin type
    if (user.adminType !== requiredAdminType) {
      return res
        .status(403)
        .json({ error: "Access denied: Invalid admin type" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export default authMiddleware;
