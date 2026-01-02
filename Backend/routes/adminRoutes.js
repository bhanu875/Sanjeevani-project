import express from "express";
import {
  getBookingsByStatus,
  approveBooking,
  rejectBooking,
} from "../controllers/adminControllers.js";

import authMiddleware, {
  verifyAdmin,
} from "../middleware/authMiddleWare.js";

const router = express.Router();

/* =========================
   ADMIN BOOKINGS
========================= */
router.get(
  "/bookings",
  authMiddleware,
  verifyAdmin,
  getBookingsByStatus
);

router.put(
  "/bookings/:id/approve",
  authMiddleware,
  verifyAdmin,
  approveBooking
);

router.put(
  "/bookings/:id/reject",
  authMiddleware,
  verifyAdmin,
  rejectBooking
);

export default router;
