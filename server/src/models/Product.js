import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  storeType: {
    type: String,
    enum: ["fast-food", "retail"],
    required: true,
  },
  maxQuantity: {
    type: Number,
    default: null,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  },
  imageUrl: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Product", productSchema);
