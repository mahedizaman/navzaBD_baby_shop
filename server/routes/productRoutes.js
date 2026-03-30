const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { optionalSingle } = require("../middleware/uploadMiddleware");

const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  rateProduct,
  updateProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.route("/").get(getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *                   - description
 *                   - price
 *                   - category
 *                   - brand
 *                   - image
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Cute Baby Hat
 *                   description:
 *                     type: string
 *                     example: Soft and warm hat
 *                   price:
 *                     type: number
 *                     example: 299
 *                   discountPercentage:
 *                     type: number
 *                     example: 10
 *                   stock:
 *                     type: number
 *                     example: 25
 *                   category:
 *                     type: string
 *                     example: 60f7f3c2d2c1a2b4c8d0e001
 *                   brand:
 *                     type: string
 *                     example: 60f7f3c2d2c1a2b4c8d0e101
 *                   image:
 *                     type: string
 *                     example: https://example.com/hat.jpg
 *               - type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - description
 *                     - price
 *                     - category
 *                     - brand
 *                     - image
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     discountPercentage:
 *                       type: number
 *                     stock:
 *                       type: number
 *                     category:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     image:
 *                       type: string
 *           examples:
 *             singleProduct:
 *               summary: Single product
 *               value:
 *                 name: Cute Baby Hat
 *                 description: Soft and warm hat
 *                 price: 299
 *                 discountPercentage: 10
 *                 stock: 25
 *                 category: 60f7f3c2d2c1a2b4c8d0e001
 *                 brand: 60f7f3c2d2c1a2b4c8d0e101
 *                 image: https://example.com/hat.jpg
 *             bulkProducts:
 *               summary: Bulk products
 *               value:
 *                 - name: Cute Baby Socks
 *                   description: Comfy socks for everyday wear
 *                   price: 199
 *                   discountPercentage: 0
 *                   stock: 60
 *                   category: 60f7f3c2d2c1a2b4c8d0e001
 *                   brand: 60f7f3c2d2c1a2b4c8d0e101
 *                   image: https://example.com/socks.jpg
 *                 - name: Baby Feeding Bottle Set
 *                   description: BPA-free feeding bottle set
 *                   price: 499
 *                   discountPercentage: 5
 *                   stock: 30
 *                   category: 60f7f3c2d2c1a2b4c8d0e002
 *                   brand: 60f7f3c2d2c1a2b4c8d0e102
 *                   image: https://example.com/bottle-set.jpg
 *     responses:
 *       201:
 *         description: Products created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Product'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 */
router
  .route("/")
  .post(protect, admin, optionalSingle("image"), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.route("/:id").get(getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Admin access required
 */
router
  .route("/:id")
  .put(protect, admin, optionalSingle("image"), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Admin access required
 */
router.route("/:id").delete(protect, admin, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/rate:
 *   post:
 *     summary: Rate a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product rated
 */
router.route("/:id/rate").post(protect, rateProduct);

module.exports = router;
