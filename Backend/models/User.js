import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: true,
    },

    // 🔴 ROLE IS CRITICAL FOR ADMIN ACCESS
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // PROFILE IMAGE
    profileImage: {
      type: String,
      default: "",
    },

    // FOLLOWERS & FOLLOWING
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
