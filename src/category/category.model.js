import mongoose from "mongoose";
import softDeletePlugins from "../plugin/softDelete.js";

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

const Category = mongoose.model("Category", categorySchema);

export default Category;
