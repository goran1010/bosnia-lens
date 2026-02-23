function isAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You need to be logged in and an admin to access this route.",
        details: [{ msg: null }],
      });
    }

    if (req.user.isAdmin) return next();

    res.status(403).json({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  } catch (err) {
    next(err);
  }
}

export { isAdmin };
