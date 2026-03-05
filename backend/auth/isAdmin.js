function isAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You need to be logged in and an admin to access this route.",
        details: [{ msg: null }],
      });
    }

    if (req.user.role === "ADMIN") return next();

    res.status(403).json({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  } catch (err) {
    next(err);
  }
}

export { isAdmin };
