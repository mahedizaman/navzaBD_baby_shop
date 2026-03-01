const generateToken = require("../utils/generateToken");
const User = require("../models/userModel");
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      address: address || [],
    });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        address: user.address,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Data");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      return res.status(200).json({
        message: "Login Successful",
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          address: user.address || [],
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error : ${error.message}` });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address || [],
      });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
