function isAdmin(req, res, next) {
  try {
    if (req.user.isAdmin) return next();

    res
      .status(403)
      .json({
        error: "You need to be admin to access this route.",
        details: [{ msg: null }],
      });
  } catch (err) {
    next(err);
  }
}

export { isAdmin };
