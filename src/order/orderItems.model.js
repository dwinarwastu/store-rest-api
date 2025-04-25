import mongoose from "mongoose";

const orderItemsSchema = mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  price: Number,
});

const OrderItems = mongoose.model("OrderItems", orderItemsSchema);

export default OrderItems;
