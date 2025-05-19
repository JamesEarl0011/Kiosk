import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const admins = [
  {
    username: "RetailAdmin",
    password: "retail123",
    adminType: "retail",
  },
  {
    username: "FastFoodAdmin",
    password: "fastfood123",
    adminType: "fast-food",
  },
];

async function createAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing admins (optional - remove if you want to keep existing admins)
    await User.deleteMany({});
    console.log("Cleared existing admins");

    // Create new admins
    for (const admin of admins) {
      const existingAdmin = await User.findOne({ username: admin.username });
      if (!existingAdmin) {
        await User.create(admin);
        console.log(`Created admin: ${admin.username}`);
      } else {
        console.log(`Admin ${admin.username} already exists`);
      }
    }

    console.log("Admin creation completed");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createAdmins();
