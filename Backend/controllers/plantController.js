import Plant from "../models/Plant.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error("Fetch plants error:", error);
    res.status(500).json({ message: "Failed to fetch plants" });
  }
};

export const getPlantById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid plant ID" });
  }

  try {
    const plant = await Plant.findById(id);

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json(plant);
  } catch (error) {
    console.error("Plant fetch error:", error);
    res.status(500).json({ message: "Error fetching plant details" });
  }
};

/* =========================
   CREATE PLANT (ADMIN ONLY)
========================= */
export const createPlant = async (req, res) => {
  try {
    const {
      name,
      botanicalName,
      family,
      localNames,
      ayushSystem,
      category,
      gardenZone,
      shortInsight,
      description,
      culturalSignificance,
      medicinalUses,
      traditionallyUsedFor,
      partsUsed,
      partsUsageDetail,
      procedure,
      safetyNotes,
      habitat,
      growthConditions,
      distribution,
      season,
    } = req.body;

    // Validate required fields
    if (!name || !botanicalName || !ayushSystem || !category || !gardenZone || !shortInsight || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle main image
    let imagePath = "";
    if (req.files && req.files.image && req.files.image[0]) {
      imagePath = `/uploads/plants/${req.files.image[0].filename}`;
    } else if (req.file) {
      imagePath = `/uploads/plants/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Main plant image is required" });
    }

    // Handle additional images
    const additionalImages = [];
    if (req.files && req.files.additionalImages) {
      req.files.additionalImages.forEach((file) => {
        additionalImages.push(`/uploads/plants/${file.filename}`);
      });
    }

    // Parse array fields
    const medicinalUsesArray = typeof medicinalUses === 'string' 
      ? medicinalUses.split(',').map(s => s.trim()).filter(s => s) 
      : (medicinalUses || []);
    
    const traditionallyUsedForArray = typeof traditionallyUsedFor === 'string'
      ? traditionallyUsedFor.split(',').map(s => s.trim()).filter(s => s)
      : (traditionallyUsedFor || []);
    
    const partsUsedArray = typeof partsUsed === 'string'
      ? partsUsed.split(',').map(s => s.trim()).filter(s => s)
      : (partsUsed || []);
    
    const localNamesArray = typeof localNames === 'string'
      ? localNames.split(',').map(s => s.trim()).filter(s => s)
      : (localNames || []);

    const plant = new Plant({
      name,
      botanicalName,
      family: family || "",
      localNames: localNamesArray,
      ayushSystem,
      category,
      gardenZone,
      shortInsight,
      description,
      culturalSignificance: culturalSignificance || "",
      medicinalUses: medicinalUsesArray,
      traditionallyUsedFor: traditionallyUsedForArray,
      partsUsed: partsUsedArray,
      partsUsageDetail: partsUsageDetail || "",
      procedure: procedure || "",
      safetyNotes: safetyNotes || "Consult a qualified AYUSH practitioner before use.",
      habitat: habitat || "",
      growthConditions: growthConditions || "",
      distribution: distribution || "",
      season: season || "",
      image: imagePath,
      additionalImages,
    });

    await plant.save();
    res.status(201).json({ message: "Plant created successfully", plant });
  } catch (error) {
    console.error("Create plant error:", error);
    res.status(500).json({ message: "Failed to create plant", error: error.message });
  }
};

/* =========================
   UPDATE PLANT (ADMIN ONLY)
========================= */
export const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // Update fields
    const updateData = { ...req.body };

    // Handle main image update
    if (req.files && req.files.image && req.files.image[0]) {
      // Delete old image if exists
      if (plant.image) {
        const oldImagePath = path.join(process.cwd(), plant.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/plants/${req.files.image[0].filename}`;
    } else if (req.file) {
      if (plant.image) {
        const oldImagePath = path.join(process.cwd(), plant.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/plants/${req.file.filename}`;
    }

    // Handle additional images
    if (req.files && req.files.additionalImages) {
      const newAdditionalImages = req.files.additionalImages.map(
        (file) => `/uploads/plants/${file.filename}`
      );
      updateData.additionalImages = [...(plant.additionalImages || []), ...newAdditionalImages];
    }

    // Parse array fields if they're strings
    if (updateData.medicinalUses && typeof updateData.medicinalUses === 'string') {
      updateData.medicinalUses = updateData.medicinalUses.split(',').map(s => s.trim()).filter(s => s);
    }
    if (updateData.traditionallyUsedFor && typeof updateData.traditionallyUsedFor === 'string') {
      updateData.traditionallyUsedFor = updateData.traditionallyUsedFor.split(',').map(s => s.trim()).filter(s => s);
    }
    if (updateData.partsUsed && typeof updateData.partsUsed === 'string') {
      updateData.partsUsed = updateData.partsUsed.split(',').map(s => s.trim()).filter(s => s);
    }
    if (updateData.localNames && typeof updateData.localNames === 'string') {
      updateData.localNames = updateData.localNames.split(',').map(s => s.trim()).filter(s => s);
    }

    const updatedPlant = await Plant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Plant updated successfully", plant: updatedPlant });
  } catch (error) {
    console.error("Update plant error:", error);
    res.status(500).json({ message: "Failed to update plant", error: error.message });
  }
};

/* =========================
   DELETE PLANT (ADMIN ONLY)
========================= */
export const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // Delete images
    if (plant.image) {
      const imagePath = path.join(process.cwd(), plant.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (plant.additionalImages && plant.additionalImages.length > 0) {
      plant.additionalImages.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Plant.findByIdAndDelete(id);
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Delete plant error:", error);
    res.status(500).json({ message: "Failed to delete plant", error: error.message });
  }
};
