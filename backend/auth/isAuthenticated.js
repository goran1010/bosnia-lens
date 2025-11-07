import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;

export default function isAuthenticated(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .sendStatus(401)
      .json({ errors: [{ msg: "Expired session token" }] });
  }

  jwt.verify(token, SECRET, (err, token) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.userId = token.id;
    next();
  });
}
