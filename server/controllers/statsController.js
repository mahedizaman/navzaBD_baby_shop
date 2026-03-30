const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ status: "paid" });
    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + (order.total || 0),
      0,
    );

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      /** alias for dashboards that label this “sales” */
      totalSales: totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};
