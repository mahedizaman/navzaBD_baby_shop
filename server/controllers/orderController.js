const Order = require("../models/orderModel");
const Product = require("../models/productModel.js");

exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("userId", "name email");
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      const orders = await Order.find({})
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }
    const orders = await Order.find({ userId: req.user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.createOrderFromCart = async (req, res, next) => {
  try {
    const { orderItems, items, shippingAddress } = req.body;

    const lineItems = Array.isArray(orderItems)
      ? orderItems
      : Array.isArray(items)
        ? items
        : [];

    if (lineItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      shippingAddress.postalCode === undefined ||
      shippingAddress.postalCode === null ||
      shippingAddress.postalCode === ""
    ) {
      res.status(400);
      throw new Error("shippingAddress is required");
    }

    const normalizedItems = lineItems.map((li) => {
      const productId = li.productId || li.product || li._id;
      const quantity = Math.floor(Number(li.quantity || li.qty || 0));
      return {
        productId,
        name: String(li.name || "Product"),
        price: Number(li.price),
        quantity,
        image: li.image || "",
      };
    });

    for (const it of normalizedItems) {
      if (!it.productId || it.quantity < 1 || !Number.isFinite(it.price)) {
        res.status(400);
        throw new Error("Invalid order items");
      }

      const product = await Product.findById(it.productId).select("stock");
      if (!product) {
        res.status(400);
        throw new Error("Invalid order items");
      }

      if (it.quantity > product.stock) {
        res.status(400);
        throw new Error(`Sorry, only ${product.stock} items available in stock`);
      }
    }

    const total = normalizedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    const order = new Order({
      userId: req.user._id,
      items: normalizedItems,
      total,
      status: "pending",
      shippingAddress: {
        street: String(shippingAddress.street),
        city: String(shippingAddress.city),
        country: String(shippingAddress.country),
        postalCode: String(shippingAddress.postalCode),
      },
    });

    const createdOrder = await order.save();

    await Promise.all(
      normalizedItems.map(async (it) => {
        const product = await Product.findById(it.productId);
        if (!product) return;
        product.stock = Math.max(0, product.stock - it.quantity);
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
      "userId",
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

    const allowed = ["pending", "paid", "completed", "cancelled"];
    const nextStatus =
      typeof status === "string" ? status.toLowerCase() : order.status;

    if (status === "Delivered") {
      order.status = "completed";
    } else if (allowed.includes(nextStatus)) {
      order.status = nextStatus;
    } else {
      res.status(400);
      throw new Error("Invalid status");
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

const FULFILLMENT_STATUSES = ["pending", "processing", "shipped", "delivered"];

exports.updateOrderFulfillment = async (req, res, next) => {
  try {
    const raw = req.body?.fulfillmentStatus ?? req.body?.status;
    const fulfillmentStatus =
      typeof raw === "string" ? raw.toLowerCase().trim() : "";

    if (!FULFILLMENT_STATUSES.includes(fulfillmentStatus)) {
      res.status(400);
      throw new Error(
        "Invalid fulfillment status. Use: pending, processing, shipped, delivered",
      );
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.fulfillmentStatus = fulfillmentStatus;
    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
