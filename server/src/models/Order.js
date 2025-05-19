import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      quantity: Number,
      price: Number,
      _id: false, // This line prevents MongoDB from creating _id for array items
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  storeType: {
    type: String,
    enum: ["retail", "fast-food"],
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
