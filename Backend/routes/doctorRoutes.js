import express from "express";
import Doctor from "../models/Doctors.js";

const router = express.Router();

/* GET ALL DOCTORS */
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ available: true });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

export default router;
