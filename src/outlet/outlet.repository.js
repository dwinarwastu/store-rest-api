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
  const outlet = await Outlet.findById(id);
  return outlet.softDelete();
  return await Outlet.findByIdAndDelete(id);
};

export const removeOutletUserRepository = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { outletId: null } },
    { new: true }
  );
};

export const countOutletRepository = async () => {
  return await Outlet.countDocuments();
};

export const getOutletByIdRepository = async (id) => {
  return await Outlet.findById(id);
};

export const getOutletRepository = async (filter = {}, options = {}) => {
  return await Outlet.paginate(filter, options);
};
