export default function isAuthenticated(req, res, next) {
  try {
    if (req.user) return next();
    res.status(403).json({ message: "You need to be logged in." });
  } catch (err) {
    next(err);
  }
}
