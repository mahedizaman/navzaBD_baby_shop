const User = require("../models/userModel");

function getCreateAdminSecret(req) {
  const headerSecret = req.headers["x-admin-secret"];
  const bodySecret = req.body?.secret;
  return headerSecret || bodySecret;
}

// Secret-protected admin creation (never exposed via public forms)
exports.adminRegister = async (req, res) => {
  try {
    const secret = getCreateAdminSecret(req);
    const expected = process.env.ADMIN_CREATE_SECRET;
    if (!expected || String(secret || "") !== String(expected)) {
      return res.status(403).json({ message: "Permission denied" });
    }

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

