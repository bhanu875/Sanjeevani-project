import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleWare.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/users/search?q=query
 * Search users by name or email (Instagram-style)
 */
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.trim().length === 0) {
      return res.json({ users: [] });
    }

    const searchQuery = q.trim();
    
    // Search by name or email (case-insensitive)
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ],
    })
      .select("name email profileImage followers following")
      .limit(20); // Limit results

    // Add follower/following counts and isFollowing status
    const usersWithCounts = users.map((user) => {
      const isFollowing = user.followers.some(
        (followerId) => followerId.toString() === currentUserId
      );

      return {
        ...user.toObject(),
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      };
    });

    res.json({ users: usersWithCounts });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Failed to search users" });
  }
});

/**
 * GET /api/users/:id
 * Fetch public user profile with follower/following counts
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email profileImage followers following"); // ✅ MUST INCLUDE profileImage

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current user is following this user
    const isFollowing = user.followers.some(
      (followerId) => followerId.toString() === req.user.id
    );

    res.json({
      user: {
        ...user.toObject(),
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      },
    });
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/**
 * POST /api/users/:id/follow
 * Follow a user
 */
router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user.id;

    // Can't follow yourself
    if (userIdToFollow === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userIdToFollow)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user to follow exists
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following list of current user
    currentUser.following.push(userIdToFollow);
    await currentUser.save();

    // Add to followers list of user being followed
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();

    // Return updated counts
    const updatedUserToFollow = await User.findById(userIdToFollow)
      .select("followers following");

    res.json({
      message: "Successfully followed user",
      followersCount: updatedUserToFollow.followers.length,
      followingCount: updatedUserToFollow.following.length,
      isFollowing: true,
    });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ message: "Failed to follow user" });
  }
});

/**
 * POST /api/users/:id/unfollow
 * Unfollow a user
 */
router.post("/:id/unfollow", authMiddleware, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user.id;

    // Can't unfollow yourself
    if (userIdToUnfollow === currentUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userIdToUnfollow)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user to unfollow exists
    const userToUnfollow = await User.findById(userIdToUnfollow);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if currently following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.following.includes(userIdToUnfollow)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following list of current user
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow
    );
    await currentUser.save();

    // Remove from followers list of user being unfollowed
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    await userToUnfollow.save();

    // Return updated counts
    const updatedUserToUnfollow = await User.findById(userIdToUnfollow)
      .select("followers following");

    res.json({
      message: "Successfully unfollowed user",
      followersCount: updatedUserToUnfollow.followers.length,
      followingCount: updatedUserToUnfollow.following.length,
      isFollowing: false,
    });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
});

/**
 * GET /api/users/:id/followers
 * Get list of followers
 */
router.get("/:id/followers", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate("followers", "name email profileImage")
      .select("followers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      followers: user.followers,
      count: user.followers.length,
    });
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
});

/**
 * GET /api/users/:id/following
 * Get list of users being followed
 */
router.get("/:id/following", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate("following", "name email profileImage")
      .select("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      following: user.following,
      count: user.following.length,
    });
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Failed to fetch following" });
  }
});

export default router;
