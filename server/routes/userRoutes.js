const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/userController");

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

router.route("/:id/addresses").post(protect, addAddress);
router
  .route("/:id/addresses/:addressId")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
