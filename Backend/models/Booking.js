import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    requestedDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    requestedTime: {
      type: String, // 09:30 AM
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // ✅ Used for rejection reason OR admin notes
    adminRemarks: {
      type: String,
      default: "",
    },

    // ✅ Which admin approved the booking
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * ✅ IMPORTANT INDEX
 * Helps quickly detect conflicts for same doctor/date/time
 * (logic enforcement is still done in controller)
 */
bookingSchema.index({
  doctor: 1,
  requestedDate: 1,
  requestedTime: 1,
  status: 1,
});

export default mongoose.model("Booking", bookingSchema);
