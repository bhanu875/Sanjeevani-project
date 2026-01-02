import mongoose from "mongoose";
import dotenv from "dotenv";
import Plant from "../models/Plant.js";

dotenv.config();

const neemPlant = {
  name: "Neem",
  botanical: "Azadirachta indica",
  system: "Ayurveda",
  uses: ["Cold", "Cough", "Immunity"],
  image: "/uploads/plants/neem.jpg",

  parts: [
    {
      name: "Leaves",
      medicinalUses: ["Cold", "Cough"],
      preparations: ["Decoction"],

      procedures: [
        {
          problem: "cold", // 🔑 lowercase – must match UI
          steps: [
            "Take 7–10 fresh neem leaves",
            "Wash them thoroughly with clean water",
            "Boil in 2 cups of water for 10 minutes",
            "Strain the liquid",
            "Drink warm once daily"
          ],
          dosage: "Once daily",
          duration: "5–7 days",
          precautions: "Avoid prolonged internal use"
        }
      ],

      ayurvedicProperties: {
        rasa: "Tikta",
        guna: "Laghu, Ruksha",
        virya: "Sheeta",
        vipaka: "Katu"
      },

      references: ["Charaka Samhita"]
    }
  ]
};

const seedOnePlant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Remove old Neem if exists
    await Plant.deleteMany({ name: "Neem" });

    // Insert fresh Neem
    await Plant.create(neemPlant);

    console.log("🌿 Neem plant seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedOnePlant();
