import express from "express";
import { createBooking } from "../controllers/bookingControllers.js";
import authMiddleware from "../middleware/authMiddleWare.js";
import Booking from "../models/Booking.js";

const router = express.Router();

/**
 * POST /api/bookings
 * Create booking (User)
 */
router.post("/", authMiddleware, createBooking);

/**
 * GET /api/bookings/doctor/:doctorId/slots?date=YYYY-MM-DD
 * Get already booked (APPROVED) time slots for a doctor on a date
 */
router.get("/doctor/:doctorId/slots", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const bookings = await Booking.find({
      doctor: doctorId,
      requestedDate: date,
      status: "APPROVED",
    }).select("requestedTime");

    const blockedSlots = bookings.map(
      (booking) => booking.requestedTime
    );

    return res.json({
      success: true,
      blockedSlots,
    });
  } catch (error) {
    console.error("Fetch blocked slots error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
