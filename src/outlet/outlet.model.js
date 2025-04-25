import mongoose from "mongoose";

const outletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
});

const Outlet = mongoose.model("Outlet", outletSchema);

export default Outlet;
