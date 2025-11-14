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

router.get("/", getAllTags);
router.get("/:id", getTagById);
router.post("/", createTag);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
