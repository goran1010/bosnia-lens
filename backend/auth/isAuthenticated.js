import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;

export default function isAuthenticated(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ errors: [{ msg: "Need to be logged in" }] });
  }

  jwt.verify(token, SECRET, (err, token) => {
    if (err) {
      return res
        .status(403)
        .json({ errors: [{ msg: "Expired session token" }] });
    }
    req.userId = token.id;
    next();
  });
}
