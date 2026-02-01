import { Router } from "express";
import authenticateToken from "../middleware/auth.js";
import { createOrder, getOrders, getOrderById } from "../controllers/orders.js";

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the provided items and processes the payment.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - paymentDetails
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               paymentMethod:
 *                 type: string
 *                 enum: [CreditCard]
 *                 example: CreditCard
 *               paymentDetails:
 *                 type: object
 *                 required:
 *                   - cardNumber
 *                   - cvv
 *                   - expirationMonth
 *                   - expirationYear
 *                   - fullName
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                   cvv:
 *                     type: string
 *                   expirationMonth:
 *                     type: string
 *                   expirationYear:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   currency:
 *                     type: string
 *                     default: USD
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         totalAmount:
 *                           type: number
 *                         status:
 *                           type: string
 *       400:
 *         description: Invalid input or payment failed
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user order history
 *     description: Retrieve a paginated list of orders for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve detailed information about a specific order.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *       403:
 *         description: Forbidden - Order does not belong to user
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getOrderById);

export default router;
