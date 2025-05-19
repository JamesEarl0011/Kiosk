import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get all orders (public endpoint)
router.get("/", getOrders);

export default router;
