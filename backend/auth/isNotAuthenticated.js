import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export default function isNotAuthenticated(req, res, next) {
  if (!ACCESS_TOKEN_SECRET) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      return next();
    }
    return res.status(403).json({ error: "Already logged in" });
  });
}
