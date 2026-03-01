const express = require("express");
const router = express.Router();

const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistProducts,
  clearWishlist,
} = require("../controllers/wishlistController.js");

const { protect } = require("../middleware/authMiddleware.js");

router.route("/").get(protect, getUserWishlist);

router.route("/add").post(protect, addToWishlist);

router.route("/remove").delete(protect, removeFromWishlist);

router.route("/products").post(protect, getWishlistProducts);

router.route("/clear").delete(protect, clearWishlist);

module.exports = router;
