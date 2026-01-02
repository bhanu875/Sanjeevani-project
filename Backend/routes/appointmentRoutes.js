import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleWare.js";

const router = express.Router();

/* =========================
   CREATE APPOINTMENT
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      return res.status(400).json({ message: "Past dates not allowed" });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctorId,
      date,
      time,
      reason,
      status: "pending", // default
    });

    res.status(201).json({
      message: "Appointment request sent. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
});

/* =========================
   GET MY APPROVED APPOINTMENTS ONLY
========================= */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const data = await Appointment.find({
      user: req.user.id,
      status: "approved", // ✅ ONLY APPROVED
    })
      .populate("doctor", "name specialty")
      .sort({ date: 1 });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

export default router;
