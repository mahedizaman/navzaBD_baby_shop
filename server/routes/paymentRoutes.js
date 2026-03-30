const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  initiatePayment,
  verifyCheckoutSession,
} = require("../controllers/paymentController.js");

router.post("/initiate", protect, initiatePayment);
router.get("/verify", verifyCheckoutSession);

module.exports = router;
