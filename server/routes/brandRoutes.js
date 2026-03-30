const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const { protect, admin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of brands
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: BabyCare
 *                   description:
 *                     type: string
 *                     example: Premium baby products brand
 *                   title:
 *                     type: string
 *                     example: Premium baby products brand
 *                   image:
 *                     type: string
 *                     example: https://example.com/brand.jpg
 *               - type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     title:
 *                       type: string
 *                     image:
 *                       type: string
 *           examples:
 *             singleBrand:
 *               summary: Single brand (object)
 *               value:
 *                 name: BabyCare
 *                 title: Premium baby products brand
 *                 description: Premium baby products brand
 *                 image: https://example.com/brand.jpg
 *             bulkBrands:
 *               summary: Bulk brands (array)
 *               value:
 *                 - name: Pampers
 *                   description: Leading diaper brand
 *                   image: https://example.com/pampers.jpg
 *                 - name: Huggies
 *                   description: Comfort diaper brand
 *                   image: https://example.com/huggies.jpg
 *     responses:
 *       201:
 *         description: Brands created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Brand'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route("/").get(getBrands).post(protect, admin, createBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand data
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 */

router
  .route("/:id")
  .get(getBrandById)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

module.exports = router;
