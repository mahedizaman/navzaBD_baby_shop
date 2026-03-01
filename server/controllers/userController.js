const Cart = require("../models/cartModel");
const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (users) {
      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, addresses } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      email,
      role,
      addresses: addresses || [],
      password,
    });

    if (user) {
      await Cart.create({ userId: user._id, items: [] });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses || [],
        cart: user.cart || [],
      });
    } else {
      res.status(404);
      throw new Error("Invalid user Data");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, avatar, address } = req.body;

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (address) fieldsToUpdate.address = address;

    if (role && req.user && req.user.role === "admin") {
      fieldsToUpdate.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile up to date",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: `User deleted successfully email : ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Only allow user to modify their own addresses or admin
  if (
    user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to modify this user's addresses");
  }

  const { street, city, country, postalCode, isDefault } = req.body;

  if (!street || !city || !country || !postalCode) {
    res.status(400);
    throw new Error("All address fields are required");
  }

  // If this is set as default, make other addresses non-default
  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  // If this is the first address, make it default
  if (user.addresses.length === 0) {
    user.addresses.push({
      street,
      city,
      country,
      postalCode,
      isDefault: true,
    });
  } else {
    user.addresses.push({
      street,
      city,
      country,
      postalCode,
      isDefault: isDefault || false,
    });
  }

  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
    message: "Address added successfully",
  });
};


exports.updateAddress = async (req, res) => {
  try {
    const { street, city, country, postalCode, isDefault } = req.body;

    // 1️⃣ Find the user
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Ownership / Admin check
    if (
      req.user.role !== "admin" &&
      user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this user's addresses" });
    }

    // 3️⃣ Validate required fields
    if (!street || !city || !country || !postalCode) {
      return res
        .status(400)
        .json({ message: "All address fields are required" });
    }

    // 4️⃣ Find the specific address
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // 5️⃣ Handle default address
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // 6️⃣ Update fields
    address.street = street;
    address.city = city;
    address.country = country;
    address.postalCode = postalCode;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    // 7️⃣ Save user
    await user.save();

    // 8️⃣ Response
    res.json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.deleteOne();

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
