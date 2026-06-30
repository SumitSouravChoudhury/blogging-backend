const User = require("../models/user");

const { hashPassword, comparePassword } = require("../utils/encryptPassword");
const { createToken } = require("../services/jwt");

const handleSignup = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName)
    return res
      .status(400)
      .json({ success: false, message: "Full name is required" });
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });

  try {
    const user = await User.create({
      fullName,
      email,
      password: await hashPassword(password),
      role,
    });

    return res
      .status(201)
      .json({ success: true, message: "User Signed up successfully!" });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credential" });
    }

    const match = comparePassword(password, user.password);

    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credential" });

    const token = createToken(user);

    return res.status(200).setHeader("Authorization", `Bearer ${token}`).json({
      success: true,
      message: "Signed in successfully",
      user: user._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSignup, handleLogin };
