import express from "express";
import { login } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();
// Admin login route with validation
router.post(
  "/admin/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("adminType")
      .isIn(["retail", "fast-food"])
      .withMessage("Admin type must be either 'retail' or 'fast-food'"),
  ],
  login
);

export default router;
