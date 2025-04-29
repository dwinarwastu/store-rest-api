import mongoose from "mongoose";
import softDeletePlugins from "../plugin/softDelete.js";
import paginationPlugin from "../plugin/pagination.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.plugin(softDeletePlugins);

categorySchema.plugin(paginationPlugin);

const Category = mongoose.model("Category", categorySchema);

export default Category;
