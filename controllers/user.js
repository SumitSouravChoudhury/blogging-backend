const User = require("../models/user");

const { hashPassword } = require("../utils/encryptPassword");

const handleGetUsers = async (req, res, next) => {
  const { search } = req.query;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit)) || 10);
  const skip = (page - 1) * limit;

  const filter = search ? { fullName: { $regex: search, $options: "i" } } : {};

  try {
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      users: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasPrev: page > 1,
        hasNext: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};

const handleUpdateUserById = async (req, res, next) => {
  const { userId } = req.params;

  const { fullName, email, password, role } = req.body;

  if (!fullName && !email && !password && !role)
    return res.status(400).json({
      success: false,
      message:
        "At least one field (fullName, email, password, role) is required",
    });

  try {
    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (password) updates.password = await hashPassword(password);
    if (role) updates.role = role;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
};
