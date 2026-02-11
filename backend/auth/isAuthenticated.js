export default function isAuthenticated(req, res, next) {
  try {
    if (req.user) return next();
    res.status(403).json({ error: "You need to be logged in." });
  } catch (err) {
    next(err);
  }
}
