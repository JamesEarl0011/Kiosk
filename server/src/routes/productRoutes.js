import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createCombo,
  updateCombo,
  deleteCombo,
  getCombos,
} from "../controllers/comboController.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// Public routes (no auth needed)
router.get("/", getProducts);

// Retail Admin-only routes
router.post("/", authMiddleware("retail"), createProduct);
router.put("/:id", authMiddleware("retail"), updateProduct);
router.delete("/:id", authMiddleware("retail"), deleteProduct);

// Fast-Food Admin-only routes
router.post("/fast-food", authMiddleware("fast-food"), createProduct);
router.put("/fast-food/:id", authMiddleware("fast-food"), updateProduct);
router.delete("/fast-food/:id", authMiddleware("fast-food"), deleteProduct);

// Fast-Food Combo routes
router.post("/fast-food/combos", authMiddleware("fast-food"), createCombo);
router.put("/fast-food/combos/:id", authMiddleware("fast-food"), updateCombo);
router.delete(
  "/fast-food/combos/:id",
  authMiddleware("fast-food"),
  deleteCombo
);
router.get("/fast-food/combos", authMiddleware("fast-food"), getCombos);

export default router;
