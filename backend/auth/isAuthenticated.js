import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export default function isAuthenticated(req, res, next) {
  if (!ACCESS_TOKEN_SECRET) {
    return res.status(500).json({ errors: [{ msg: "Server configuration error" }] });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ errors: [{ msg: "Need to be logged in" }] });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, token) => {
    if (err) {
      return res
        .status(403)
        .json({ errors: [{ msg: "Expired session token" }] });
    }
    req.userId = token.id;
    next();
  });
}
