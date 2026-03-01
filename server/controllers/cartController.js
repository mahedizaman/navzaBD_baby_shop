const Cart = require("../models/cartModel");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    res.status(200).json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity, price } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.product.toString() === productId,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price }],
      });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const item = cart.items.find((p) => p.product.toString() === productId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404);
        throw new Error("Item not found in cart");
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.removeItemFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(
        (p) => p.product.toString() !== req.params.productId,
      );
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
      res.status(200).json({ message: "Cart cleared" });
    }
  } catch (error) {
    next(error);
  }
};
