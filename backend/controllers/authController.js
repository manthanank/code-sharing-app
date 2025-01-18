const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");

// Register User
exports.register = async (req, res, io) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    if (io) io.emit("register", { id: user._id, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
exports.login = async (req, res, io) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    if (io) io.emit("login", { id: user._id, email: user.email });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res, io) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (io) io.emit("getUser", { id: user._id, email: user.email });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, io) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    if (io) io.emit("forgotPassword", { id: user._id, email: user.email });

    const subject = "Password Reset";
    const endPoint =
      req.headers.host === "localhost:3000"
        ? "http://localhost:4200"
        : "https://code-sharing-app-manthanank.vercel.app/";
    const content = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    
    Please click on the following link, or paste this into your browser to complete the process:
    
    ${endPoint}/reset-password/${token}/${email}
    
    If you did not request this, please ignore this email and your password will remain unchanged.`;
    sendEmail(email, subject, content);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res, io) => {
  const { token, email } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.resetPasswordToken !== token)
      return res.status(400).json({ error: "Invalid or expired token" });

    if (Date.now() > user.resetPasswordExpires) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      return res.status(400).json({ error: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    if (io) io.emit("resetPassword", { id: user._id, email: user.email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.logout = async (req, res, io) => {
  try {
    if (io) io.emit("logout", { id: req.body.id, email: req.body.email });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};