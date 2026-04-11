import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      // 401 is expected if not logged in; no need to log as error
      return res.status(401).json({ 
        success: false,
        message: "Authentication required: No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
       return res.status(401).json({ success: false, message: "Authentication failed: Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token" 
    });
  }
};