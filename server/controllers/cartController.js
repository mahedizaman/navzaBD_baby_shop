const Cart = require("../models/cartModel");
const Product = require("../models/productModel.js");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
    );
    res.status(200).json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const rawProductId = req.body.productId || req.body.product;
    const rawQty = req.body.quantity;
    const rawPrice = req.body.price;
    const rawName = req.body.name;
    const rawImage = req.body.image;

    const productId = String(rawProductId || "");
    const quantity = Math.floor(Number(rawQty || 0));
    const price = rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : undefined;

    if (!productId) {
      res.status(400);
      throw new Error("Invalid productId");
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      res.status(400);
      throw new Error("Invalid quantity");
    }

    const product = await Product.findById(productId).select(
      "stock name image price",
    );
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        const nextQty = cart.items[itemIndex].quantity + quantity;
        if (nextQty > product.stock) {
          res.status(400);
          throw new Error(
            `Sorry, only ${product.stock} items available in stock`,
          );
        }
        cart.items[itemIndex].quantity = nextQty;
      } else {
        if (quantity > product.stock) {
          res.status(400);
          throw new Error(
            `Sorry, only ${product.stock} items available in stock`,
          );
        }

        cart.items.push({
          productId,
          name: rawName || product.name,
          image: rawImage || product.image,
          price: Number.isFinite(price) ? price : product.price,
          quantity,
        });
      }
      cart = await cart.save();
    } else {
      if (quantity > product.stock) {
        res.status(400);
        throw new Error(`Sorry, only ${product.stock} items available in stock`);
      }

      cart = await Cart.create({
        userId: req.user._id,
        items: [
          {
            productId,
            name: rawName || product.name,
            image: rawImage || product.image,
            price: Number.isFinite(price) ? price : product.price,
            quantity,
          },
        ],
      });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const rawProductId = req.body.productId || req.body.product;
    const rawQty = req.body.quantity;

    const productId = String(rawProductId || "");
    const quantity = Math.floor(Number(rawQty || 0));

    if (!productId) {
      res.status(400);
      throw new Error("Invalid productId");
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      res.status(400);
      throw new Error("Invalid quantity");
    }

    const product = await Product.findById(productId).select("stock");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (quantity > product.stock) {
      res.status(400);
      throw new Error(`Sorry, only ${product.stock} items available in stock`);
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      const item = cart.items.find((p) => p.productId.toString() === productId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404);
        throw new Error("Item not found in cart");
      }
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.removeItemFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(
        (p) => p.productId.toString() !== req.params.productId,
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
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
      res.status(200).json({ message: "Cart cleared" });
    }
  } catch (error) {
    next(error);
  }
};
