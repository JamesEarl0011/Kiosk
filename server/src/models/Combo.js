import mongoose from "mongoose";

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  components: {
    main: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    sides: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  discount: { type: Number, default: 0.4 },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Combo", comboSchema);
