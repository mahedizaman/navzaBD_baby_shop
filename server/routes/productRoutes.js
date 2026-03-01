const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  rateProduct,
  updateProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id/rate").post(protect, rateProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
