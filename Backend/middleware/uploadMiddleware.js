import multer from "multer";
import path from "path";
import fs from "fs";

/* =========================
   HELPER: ENSURE FOLDER EXISTS
========================= */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* =========================
   COMMUNITY UPLOAD CONFIG
========================= */
const communityDir = "uploads/community";
ensureDir(communityDir);

const communityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, communityDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  },
});

/* =========================
   PRODUCT UPLOAD CONFIG
========================= */
const productDir = "uploads/products";
ensureDir(productDir);

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  },
});

/* =========================
   PLANT UPLOAD CONFIG
========================= */
const plantDir = "uploads/plants";
ensureDir(plantDir);

const plantStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, plantDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `plant-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

/* =========================
   FILE FILTER (IMAGES ONLY)
========================= */
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* =========================
   MULTER INSTANCES
========================= */

// ✅ Community images (posts, profiles, etc.)
export const uploadCommunityImage = multer({
  storage: communityStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ Product images (admin uploads)
export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ✅ Plant images (admin uploads for herbal garden)
export const uploadPlantImage = multer({
  storage: plantStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for plant images
});

/* =========================
   DEFAULT EXPORT (BACKWARD COMPATIBILITY)
========================= */
// ⚠️ Defaults to community upload so existing imports don't break
export default uploadCommunityImage;
