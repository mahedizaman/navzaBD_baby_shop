const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");

const { protect, admin } = require("../middleware/authMiddleware.js");
const { optionalSingle } = require("../middleware/uploadMiddleware.js");


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Create new category (Admin only)
 *     tags: [Categories]
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
 *                   - categoryType
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Diapers
 *                   description:
 *                     type: string
 *                     example: Premium diaper products
 *                   image:
 *                     type: string
 *                     example: https://example.com/diapers.jpg
 *                   categoryType:
 *                     type: string
 *                     enum: [Featured, "Hot Categories", "Top Categories"]
 *                     example: Featured
 *               - type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - categoryType
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     image:
 *                       type: string
 *                     categoryType:
 *                       type: string
 *                       enum: [Featured, "Hot Categories", "Top Categories"]
 *           examples:
 *             singleCategory:
 *               summary: Single category
 *               value:
 *                 name: Diapers
 *                 description: Premium diaper products
 *                 image: https://example.com/diapers.jpg
 *                 categoryType: Featured
 *             bulkCategories:
 *               summary: Bulk categories
 *               value:
 *                 - name: Feeding
 *                   description: Baby feeding products
 *                   image: https://example.com/feeding.jpg
 *                   categoryType: Hot Categories
 *                 - name: Toys
 *                   description: Baby toys & learning kits
 *                   image: https://example.com/toys.jpg
 *                   categoryType: Top Categories
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Category'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.route("/").get(getCategories).post(protect, admin, optionalSingle("image"), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, optionalSingle("image"), updateCategory)
  .delete(protect, admin, deleteCategory);


module.exports = router;
