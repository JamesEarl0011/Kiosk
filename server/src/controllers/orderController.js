import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { generateReceiptPDF } from "../utils/receiptGenerator.js";

export const createOrder = async (req, res) => {
  const { items, storeType } = req.body;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for order");
    }

    let totalPrice = 0;
    const orderItems = [];

    // Validate stock and calculate total
    for (const item of items) {
      if (!item._id || !item.quantity) {
        throw new Error("Invalid item data");
      }

      const product = await Product.findById(item._id);
      if (!product) {
        throw new Error(`Product not found: ${item._id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      items: orderItems,
      totalPrice,
      storeType,
      receiptNumber: `REC-${Date.now()}`,
    });

    await order.save();

    // Populate product details before sending response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name price")
      .lean();

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({ error: error.message || "Failed to create order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { storeType } = req.query;

    // Build query object
    const query = {};
    if (storeType) {
      query.storeType = storeType;
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price") // Populate product details
      .lean();

    // Remove _id from each item in the orders
    const ordersWithoutItemIds = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.json(ordersWithoutItemIds);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
