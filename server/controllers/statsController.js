const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders: orders.length,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};
