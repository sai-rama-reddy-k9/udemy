const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const handleRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newuser = new User({ name, email, password: hashedPassword, role });
    await newuser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during registration.", error });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true, // Blocks client-side JS (XSS defense)
      secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
      sameSite: "lax", // Mitigates CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Expiry: 1 day
    });
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during Login.", error });
  }
};

const handleLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed.", error });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is populated by your JWT authentication middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = { handleRegister, handleLogin, handleLogout, getMe };
