import mongoose from "mongoose";
import softDeletePlugins from "../plugin/softDelete.js";

const outletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
});

outletSchema.plugin(softDeletePlugins);

const Outlet = mongoose.model("Outlet", outletSchema);

export default Outlet;
