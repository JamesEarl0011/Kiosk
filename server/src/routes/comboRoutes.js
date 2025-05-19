import express from "express";
import {
  createCombo,
  updateCombo,
  deleteCombo,
  getCombos,
} from "../controllers/comboController.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware("fast-food"), createCombo);

router.put("/:id", authMiddleware("fast-food"), updateCombo);

router.delete("/:id", authMiddleware("fast-food"), deleteCombo);

router.get("/", authMiddleware("fast-food"), getCombos);

export default router;
