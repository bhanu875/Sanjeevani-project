import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    time: {
      type: String, // HH:mm
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    // ✅ REQUIRED FOR ADMIN APPROVAL FLOW
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
