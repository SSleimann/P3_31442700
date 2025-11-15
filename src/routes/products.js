import {
  createProduct,
  getProduct,
  filterProducts,
  updateProduct,
  deleteProduct,
  autoHealingGetProduct,
} from "../controllers/products.js";
import authenticateToken from "../middleware/auth.js";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of tag IDs to associate with the product (UUIDs)
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *                     categoryId:
 *                       type: string
 *                       format: uuid
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Filter products
 *     description: Retrieve a list of products with optional filters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name__eq
 *         schema:
 *           type: string
 *         description: Filter by product name (exact match).
 *       - in: query
 *         name: name__like
 *         schema:
 *           type: string
 *         description: Filter by product name (partial match).
 *       - in: query
 *         name: description__eq
 *         schema:
 *           type: string
 *         description: Filter by product description (exact match).
 *       - in: query
 *         name: description__like
 *         schema:
 *           type: string
 *         description: Filter by product description (partial match).
 *       - in: query
 *         name: price__eq
 *         schema:
 *           type: number
 *         description: Filter by product price (exact match).
 *       - in: query
 *         name: price__gt
 *         schema:
 *           type: number
 *         description: Filter for products with a price greater than the specified value.
 *       - in: query
 *         name: price__lt
 *         schema:
 *           type: number
 *         description: Filter for products with a price less than the specified value.
 *       - in: query
 *         name: stock__eq
 *         schema:
 *           type: integer
 *         description: Filter by product stock (exact match).
 *       - in: query
 *         name: stock__gt
 *         schema:
 *           type: integer
 *         description: Filter for products with stock greater than the specified value.
 *       - in: query
 *         name: stock__lt
 *         schema:
 *           type: integer
 *         description: Filter for products with stock less than the specified value.
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID (UUID).
 *       - in: query
 *         name: productTags__name__eq
 *         schema:
 *           type: string
 *         description: Filter by the name of a tag (exact match).
 *       - in: query
 *         name: productTags__id__in
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         style: form
 *         explode: false
 *         description: Filter by a list of tag IDs (comma-separated, UUIDs).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       categoryId:
 *                         type: string
 *                         format: uuid
 *       500:
 *         description: Internal server error.
 */
router.get("/", filterProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Product id
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
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of tag IDs to associate with the product (UUIDs)
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *                     categoryId:
 *                       type: string
 *                       format: uuid
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, deleteProduct);

/**
 * @swagger
 * /products/auto-healing/{id}:
 *   get:
 *     summary: Get a product by slug-or-id with auto-healing redirect
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       301:
 *         description: Redirect to canonical product URL (Location header)
 *       400:
 *         description: Invalid product identifier
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/auto-healing/:id", autoHealingGetProduct);

export default router;
