import express from "express";
import authMiddleware from "../middleware/authMiddleWare.js";
import { uploadCommunityImage } from "../middleware/uploadMiddleware.js";

import {
  createPost,
  getAllPosts,
  getPostsByPlant,
  getMyPosts,
  getPostsByUser,
  toggleLikePost,
  addComment,
} from "../controllers/communityControllers.js";

const router = express.Router();

/* ================= COMMUNITY FEED ================= */
// GET /api/community
router.get("/", getAllPosts);

/* ================= USER POSTS ================= */
// GET /api/community/my-posts (logged-in user)
router.get("/my-posts", authMiddleware, getMyPosts);

// GET /api/community/user/:userId (public profile)
router.get("/user/:userId", getPostsByUser);

/* ================= PLANT POSTS ================= */
// GET /api/community/plant/:plantId
router.get("/plant/:plantId", getPostsByPlant);

/* ================= CREATE POST ================= */
// POST /api/community
router.post(
  "/",
  authMiddleware,
  uploadCommunityImage.array("images", 5),
  createPost
);

/* ================= LIKES ================= */
// PUT /api/community/:id/like
router.put("/:id/like", authMiddleware, toggleLikePost);

/* ================= COMMENTS ================= */
// POST /api/community/:postId/comment
router.post("/:postId/comment", authMiddleware, addComment);

export default router;
