import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import comboRoutes from "./src/routes/comboRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import setupSwagger from "./src/config/swagger.js";
import { connectDB } from "./src/config/db.js";
import User from "./src/models/User.js";
import errorHandler from "./src/utils/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173" || process.env.CLIENT_URI, // Vite's default port
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB and create admins
connectDB().then(async () => {
  // Create retail admin if it doesn't exist
  const retailAdminExists = await User.findOne({ username: "RetailAdmin" });
  if (!retailAdminExists) {
    const retailAdmin = new User({
      username: "RetailAdmin",
      password: "retail123",
      adminType: "retail",
    });
    await retailAdmin.save();
    console.log("Retail admin created");
  }

  // Create fast-food admin if it doesn't exist
  const fastFoodAdminExists = await User.findOne({ username: "FastFoodAdmin" });
  if (!fastFoodAdminExists) {
    const fastFoodAdmin = new User({
      username: "FastFoodAdmin",
      password: "fastfood123",
      adminType: "fast-food",
    });
    await fastFoodAdmin.save();
    console.log("Fast-food admin created");
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/orders", orderRoutes);

// Error handler middleware (moved after routes)
app.use(errorHandler);

// Setup Swagger
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
