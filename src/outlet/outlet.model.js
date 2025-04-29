import mongoose from "mongoose";
import softDeletePlugins from "../plugin/softDelete.js";
import paginationPlugin from "../plugin/pagination.js";

const outletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
});

outletSchema.plugin(softDeletePlugins);

outletSchema.plugin(paginationPlugin);

const Outlet = mongoose.model("Outlet", outletSchema);

export default Outlet;
