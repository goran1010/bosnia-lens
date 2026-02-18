function isAuthenticated(req, res, next) {
  try {
    if (req.user.isAdmin) return next();
    res
      .status(403)
      .json({ error: "You need to be admin to access this route." });
  } catch (err) {
    next(err);
  }
}

export { isAuthenticated };
