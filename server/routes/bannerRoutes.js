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

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - name
 *         - title
 *         - startFrom
 *         - image
 *         - bannerType
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         title:
 *           type: string
 *         startFrom:
 *           type: number
 *         image:
 *           type: string
 *         bannerType:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 *   post:
 *     summary: Create new banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - title
 *               - startFrom
 *               - image
 *               - bannerType
 *             properties:
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               startFrom:
 *                 type: number
 *               image:
 *                 type: string
 *               bannerType:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Banner created successfully
 */

router.route("/").get(getBanners).post(protect, admin, createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get a banner by ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 *   put:
 *     summary: Update banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               startFrom:
 *                 type: number
 *               image:
 *                 type: string
 *               bannerType:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *   delete:
 *     summary: Delete banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */

router
  .route("/:id")
  .get(protect, getBannerById)
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;
