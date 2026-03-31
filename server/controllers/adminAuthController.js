const User = require("../models/userModel");

// Admin registration (creates a User with role=admin)
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const admin = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: "admin",
      addresses: [],
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

