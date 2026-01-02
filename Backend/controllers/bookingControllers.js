import Booking from "../models/Booking.js";
import Doctors from "../models/Doctors.js";

/**
 * POST /api/bookings
 * User – create booking
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { doctorId, reason, requestedDate, requestedTime } = req.body;

    // ✅ Basic validation
    if (!doctorId || !reason || !requestedDate || !requestedTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check doctor exists
    const doctorExists = await Doctors.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 🚫 DOUBLE BOOKING PROTECTION (CORE LOGIC)
    const alreadyBooked = await Booking.findOne({
      doctor: doctorId,
      requestedDate,
      requestedTime,
      status: "APPROVED",
    });

    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // ✅ Create booking (PENDING by default)
    const booking = await Booking.create({
      user: userId,
      doctor: doctorId,
      reason,
      requestedDate,
      requestedTime,
    });

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};
