const express = require("express");
const { adminRegister } = require("../controllers/adminAuthController");

const router = express.Router();

// POST /api/admin/register
router.post("/register", adminRegister);

module.exports = router;

