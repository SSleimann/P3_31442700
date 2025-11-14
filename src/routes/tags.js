import express from "express";
import authenticateToken from "../middleware/auth.js";

import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tags.js";

const router = express.Router();
router.use(authenticateToken);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     description: Retrieves a list of all tags
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved tags
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Get tag by ID
 *     description: Retrieves a specific tag by its ID
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tag ID (UUID)
 *     responses:
 *       200:
 *         description: Successfully retrieved tag
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTagById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     description: Creates a new tag with a name
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sale
 *     responses:
 *       201:
 *         description: Tag successfully created
 *       400:
 *         description: Bad request - missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createTag);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Update a tag
 *     description: Updates an existing tag by ID
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tag ID (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag successfully updated
 *       400:
 *         description: Bad request - missing fields
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     description: Deletes a tag by ID
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tag ID (UUID)
 *     responses:
 *       200:
 *         description: Tag successfully deleted
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteTag);

export default router;
