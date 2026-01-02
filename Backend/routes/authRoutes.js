import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

import authMiddleware from "../middleware/authMiddleWare.js";
import User from "../models/User.js";
import isStrongPassword from "../utils/passwordValidator.js";

const router = express.Router();

/* ======================================================
   MULTER CONFIG (PROFILE IMAGE UPLOAD)
====================================================== */

// Ensure uploads folder exists
const uploadDir = "uploads/profile";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

/* ================= GET LOGGED-IN USER ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* ================= PROFILE IMAGE UPLOAD ================= */
router.put(
  "/profile-image",
  authMiddleware,
  (req, res, next) => {
    upload.single("profileImage")(req, res, (err) => {
      if (err) {
        // Handle multer errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File size too large. Maximum 5MB allowed." });
        }
        if (err.message === "Only image files allowed") {
          return res.status(400).json({ message: "Only image files are allowed" });
        }
        return res.status(400).json({ message: err.message || "File upload error" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imagePath = `/uploads/profile/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: imagePath },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile image updated",
        user,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ 
        message: "Profile image update failed",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
);

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (email && !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password does not meet security rules" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user", // default role
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email/phone and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* 🔥 JWT WITH ROLE (CRITICAL FIX) */
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role, // 🔥 REQUIRED FOR ADMIN
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= CHECK EMAIL ================= */
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    res.json({ message: "Email exists" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password does not meet security rules" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
});

export default router;
