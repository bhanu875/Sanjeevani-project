import CommunityPost from "../models/CommunityPost.js";
import mongoose from "mongoose";

/* =========================================================
   CREATE COMMUNITY POST
   POST /api/community
========================================================= */
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, plant, plantPart, application } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // Validate plant ID if provided
    if (plant && !mongoose.Types.ObjectId.isValid(plant)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plant ID",
      });
    }

    /* MULTIPLE IMAGE SUPPORT */
    const images =
      req.files?.map(
        (file) => `/uploads/community/${file.filename}`
      ) || [];

    const post = await CommunityPost.create({
      user: userId,
      content: content.trim(),
      plant: plant || undefined,
      plantPart: plantPart?.trim() || undefined,
      herbName: req.body.herbName?.trim() || undefined,
      application: application?.trim() || "",
      images,
      likes: [],
      comments: [],
    });

    const populatedPost = await CommunityPost.findById(post._id)
      .populate("user", "name profileImage")
      .populate("plant", "name image");

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

/* =========================================================
   GET ALL COMMUNITY POSTS (FEED)
   GET /api/community
========================================================= */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage")
      .populate("plant", "name image");

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/* =========================================================
   GET POSTS BY PLANT
   GET /api/community/plant/:plantId
========================================================= */
export const getPostsByPlant = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { part } = req.query;

    if (!mongoose.Types.ObjectId.isValid(plantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plant ID",
      });
    }

    const query = { plant: plantId };
    if (part) query.plantPart = part;

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage")
      .populate("plant", "name image");

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error("Fetch plant posts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plant posts",
    });
  }
};

/* =========================================================
   GET MY POSTS (LOGGED-IN USER DASHBOARD)
   GET /api/community/my-posts
========================================================= */
export const getMyPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("plant", "name image")
      .populate("user", "name profileImage");

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error("Fetch my posts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/* =========================================================
   GET POSTS BY USER (PUBLIC PROFILE)
   GET /api/community/user/:userId
========================================================= */
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const posts = await CommunityPost.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("plant", "name image")
      .populate("user", "name profileImage");

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error("Fetch user posts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
    });
  }
};

/* =========================================================
   LIKE / UNLIKE POST
   PUT /api/community/:id/like
========================================================= */
export const toggleLikePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.id;
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({
      success: false,
      message: "Like failed",
    });
  }
};

/* =========================================================
   ADD COMMENT TO POST
   POST /api/community/:postId/comment
========================================================= */
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate("comments.user", "name profileImage");

    res.status(201).json({
      success: true,
      comments: populatedPost.comments,
    });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
