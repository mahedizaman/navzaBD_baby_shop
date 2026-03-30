const Order = require("../models/orderModel");
const Product = require("../models/productModel.js");

exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.createOrderFromCart = async (req, res, next) => {
  try {
    const {
      orderItems,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const lineItems = Array.isArray(orderItems)
      ? orderItems
      : Array.isArray(items)
        ? items
        : [];

    if (lineItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Validate and reserve stock (basic non-transactional approach)
    for (const li of lineItems) {
      const pid = li.productId || li.product || li._id;
      const qty = Math.floor(Number(li.quantity || li.qty || 0));
      if (!pid || !Number.isFinite(qty) || qty < 1) {
        res.status(400);
        throw new Error("Invalid order items");
      }

      const product = await Product.findById(pid).select("stock");
      if (!product) {
        res.status(400);
        throw new Error("Invalid order items");
      }

      if (qty > product.stock) {
        res.status(400);
        throw new Error(`Sorry, only ${product.stock} items available in stock`);
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems: lineItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Decrement stock for each purchased item
    await Promise.all(
      lineItems.map(async (li) => {
        const pid = li.productId || li.product || li._id;
        const qty = Math.floor(Number(li.quantity || li.qty || 0));
        const product = await Product.findById(pid);
        if (!product) return;
        product.stock = Math.max(0, product.stock - qty);
        // status auto-updated in productModel pre-save
        await product.save();
      }),
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status || order.status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.status(200).json({ message: "Order removed" });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};
