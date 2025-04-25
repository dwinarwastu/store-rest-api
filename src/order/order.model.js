import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderItemId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItems",
    },
  ],
  shippingAddress: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  totalPrice: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
