import mongoose from "mongoose";

/* =========================
   COMMENT SCHEMA
========================= */
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* =========================
   COMMUNITY POST SCHEMA
========================= */
const communityPostSchema = new mongoose.Schema(
  {
    /* AUTHOR */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* MAIN EXPERIENCE / REMEDY */
    content: {
      type: String,
      required: true,
      trim: true,
    },

    /* 🌿 LINK TO PLANT (OPTIONAL FOR GENERAL POSTS) */
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: false,
    },

    /* 🌿 PLANT PART (OPTIONAL FOR GENERAL POSTS) */
    plantPart: {
      type: String, // Leaves, Root, Bark, Seed
      required: false,
      trim: true,
    },

    /* 🌿 HERB NAME (FOR SIMPLE POSTS) */
    herbName: {
      type: String,
      trim: true,
    },

    /* 🌿 CONTEXT OF USE (OPTIONAL BUT VALUABLE) */
    application: {
      type: String, // e.g. Skin care, Digestion, Fever
      trim: true,
    },

    /* OPTIONAL IMAGES */
    images: [
      {
        type: String,
      },
    ],

    /* SOCIAL SIGNALS */
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CommunityPost", communityPostSchema);
