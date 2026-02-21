function isAuthenticated(req, res, next) {
  try {
    if (req.user) return next();
    res
      .status(401)
      .json({ error: "You are not logged in.", details: [{ msg: null }] });
  } catch (err) {
    next(err);
  }
}

export { isAuthenticated };
