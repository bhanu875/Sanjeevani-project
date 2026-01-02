import Booking from "../models/Booking.js";
import Appointment from "../models/Appointment.js";

/**
 * GET /api/admin/bookings?status=PENDING
 */
export const getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("doctor", "name specialty")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Admin Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * PUT /api/admin/bookings/:id/approve
 */
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed",
      });
    }

    booking.status = "APPROVED";
    booking.adminRemarks = req.body.adminRemarks || "";
    booking.approvedBy = req.user.id;
    await booking.save();

    // ✅ FIX IS HERE
    const appointment = await Appointment.create({
      user: booking.user,
      doctor: booking.doctor,
      date: booking.requestedDate,
      time: booking.requestedTime,
      booking: booking._id,
      status: "approved", // 🔥 REQUIRED
    });

    res.status(200).json({
      success: true,
      message: "Booking approved",
      appointment,
    });
  } catch (error) {
    console.error("Approve Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * PUT /api/admin/bookings/:id/reject
 */
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "REJECTED";
    booking.adminRemarks = req.body.adminRemarks || "";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected",
    });
  } catch (error) {
    console.error("Reject Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
