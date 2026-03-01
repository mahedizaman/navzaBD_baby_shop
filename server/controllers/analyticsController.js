const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductAnalytics = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } });
    res.status(200).json({ lowStockProducts });
  } catch (error) {
    next(error);
  }
};

exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.status(200).json(salesData);
  } catch (error) {
    next(error);
  }
};

exports.getInventoryAlerts = async (req, res, next) => {
  try {
    const outOfStock = await Product.countDocuments({ countInStock: 0 });
    res.status(200).json({ outOfStock });
  } catch (error) {
    next(error);
  }
};
