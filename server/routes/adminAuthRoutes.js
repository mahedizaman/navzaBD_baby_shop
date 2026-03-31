const express = require("express");
const { adminRegister } = require("../controllers/adminAuthController");

const router = express.Router();

// POST /api/admin/create (secret-protected)
router.post("/create", adminRegister);

module.exports = router;

