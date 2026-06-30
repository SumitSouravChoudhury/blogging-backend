const accessTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, messsage: "Authentication required" });

    if (roles.length > 0 && !roles.includes(req.user.role))
      return res
        .status(403)
        .json({ success: false, message: "Forbidden from action" });

    next();
  };
};

module.exports = { accessTo };
