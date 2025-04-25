import Outlet from "./outlet.model.js";
import User from "../user/user.model.js";

export const registerOutletRepository = async (id, data) => {
  const newOutlet = new Outlet(data);
  const saveOutlet = await newOutlet.save();

  return await User.findByIdAndUpdate(
    id,
    { outletId: saveOutlet._id },
    { new: true }
  ).populate("outletId");
};

export const findByIdOutletInUserRepository = async (id) => {
  return await User.findById(id).populate("outletId");
};

export const updateOutletRepository = async (id, data) => {
  return await Outlet.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOutletRepository = async (id) => {
  return await Outlet.findByIdAndDelete(id);
};

export const removeOutletUserRepository = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { outletId: null } },
    { new: true }
  );
};

export const getOutletRepository = async (startIndex, limit) => {
  return await Outlet.find({}).skip(startIndex).limit(limit).lean().exec();
};

export const countOutletRepository = async () => {
  return await Outlet.countDocuments();
};

export const getOutletByIdRepository = async (id) => {
  return await Outlet.findById(id);
};
