import mongoose from "mongoose";
import softDeletePlugins from "../plugin/softDelete.js";
import paginationPlugin from "../plugin/pagination.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(softDeletePlugins);

productSchema.plugin(paginationPlugin);

const Product = mongoose.model("Product", productSchema);

export default Product;
