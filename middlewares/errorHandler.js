const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(409)
      .json({ success: false, message: `${field} already exists` });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  return res.status(status).json({ success: false, message: message });
};

module.exports = { errorHandler };
