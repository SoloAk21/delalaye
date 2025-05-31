import express from "express";
import { check } from "express-validator";
import brandingController from "../controllers/admin/branding.controller";
import { validate } from "../middlewares/validate";
import auth from "../middlewares/auth";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PNG and SVG files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}); // Remove .fields() to allow multer to process all fields

// @route   GET api/branding
// @desc    Get branding settings
// @access  Public
router.get("/", brandingController.getBranding);

// @route   POST api/branding
// @desc    Update branding settings
// @access  Private (Admin)
router.post(
  "/",
  auth,
  upload.any(), // Use .any() to parse all fields (files and text)
  [
    check("primaryColor")
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage("Primary color must be a valid hex code"),
    check("secondaryColor")
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage("Secondary color must be a valid hex code"),
    check("darkModeDefault")
      .isBoolean()
      .withMessage("Dark mode default must be a boolean"),
  ],
  validate,
  brandingController.updateBranding
);

export default router;
