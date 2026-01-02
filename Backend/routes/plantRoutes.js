import express from "express";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";
import authMiddleware, { verifyAdmin } from "../middleware/authMiddleWare.js";
import { uploadPlantImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPlants);
router.get("/:id", getPlantById);

// Admin routes - protected
router.post(
  "/",
  authMiddleware,
  verifyAdmin,
  uploadPlantImage.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  createPlant
);

router.put(
  "/:id",
  authMiddleware,
  verifyAdmin,
  uploadPlantImage.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  updatePlant
);

router.delete("/:id", authMiddleware, verifyAdmin, deletePlant);

export default router;
