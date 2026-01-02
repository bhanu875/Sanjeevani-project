import User from "../models/User.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imagePath = `/uploads/profile/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    ).select("_id name email profileImage");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ MATCH /api/auth/me RESPONSE SHAPE
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Profile image upload failed",
    });
  }
};
