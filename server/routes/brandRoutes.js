const express = require("express");
const router = express.Router();

const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController.js");

const { protect, admin } = require("../middleware/authMiddleware.js");


router.route("/").get(getBanners).post(protect, admin, createBanner);


router
  .route("/:id")
  .get(protect, getBannerById)
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;
