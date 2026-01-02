import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    /* ================= BASIC IDENTITY ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    botanicalName: {
      type: String,
      required: true,
    },

    family: {
      type: String,
      default: "",
    },

    localNames: {
      type: [String], // Telugu, Hindi, Sanskrit names
      default: [],
    },

    ayushSystem: {
      type: String,
      enum: ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"],
      required: true,
    },

    category: {
      type: String, // Herb, Tree, Shrub
      required: true,
    },

    gardenZone: {
      type: String,
      required: true,
    },

    /* ================= QUICK INSIGHT (FLIP CARD) ================= */
    shortInsight: {
      type: String,
      required: true,
    },

    /* ================= STORY CONTENT ================= */
    description: {
      type: String,
      required: true,
    },

    culturalSignificance: {
      type: String,
      default: "",
    },

    /* ================= MEDICINAL INFORMATION ================= */
    medicinalUses: {
      type: [String],
      required: true,
    },

    traditionallyUsedFor: {
      type: [String], // symptoms (educational only)
      default: [],
    },

    partsUsed: {
      type: [String],
      required: true,
    },

    partsUsageDetail: {
      type: String,
      default: "",
    },

    traditionalUses: {
      type: [String],
      default: [],
    },

    procedure: {
      type: String,
      default: "",
    },

    safetyNotes: {
      type: String,
      default: "Consult a qualified AYUSH practitioner before use.",
    },

    /* ================= HABITAT & GROWTH ================= */
    habitat: {
      type: String,
      default: "",
    },

    growthConditions: {
      type: String,
      default: "",
    },

    distribution: {
      type: String,
      default: "",
    },

    season: {
      type: String,
      default: "",
    },

    /* ================= IMAGES ================= */
    image: {
      type: String,
      required: true,
    },

    additionalImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plant", plantSchema);
