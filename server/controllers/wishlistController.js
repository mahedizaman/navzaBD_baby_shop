const Wishlist = require("../models/userModel");

exports.getUserWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
    );
    res.status(200).json(wishlist || { products: [] });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    } else {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId,
      );
      await wishlist.save();
      res.status(200).json(wishlist);
    }
  } catch (error) {
    next(error);
  }
};

exports.getWishlistProducts = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
    );
    if (!wishlist) {
      return res.status(200).json([]);
    }
    res.status(200).json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

exports.clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] });
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    next(error);
  }
};
