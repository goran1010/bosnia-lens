export default function isNotAuthenticated(req, res, next) {
  if (!req.user) return next();
  res
    .status(403)
    .json({ message: "You shouldn't be logged in.", details: [{ msg: null }] });
}
