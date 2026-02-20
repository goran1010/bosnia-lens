export default function isAuthenticated(req, res, next) {
  try {
    if (req.user) return next();
    res.status(401).json({ error: "You need to be logged in." });
  } catch (err) {
    next(err);
  }
}
