function isContributor(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "You need to be logged in and a contributor to access this route.",
        details: [{ msg: null }],
      });
    }

    if (req.user.isContributor) return next();

    res.status(403).json({
      error: "You need to be a contributor to access this route.",
      details: [{ msg: null }],
    });
  } catch (err) {
    next(err);
  }
}

export { isContributor };
