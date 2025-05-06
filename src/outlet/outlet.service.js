import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../utils/error.js";
import {
  deleteOutletRepository,
  findByIdOutletInUserRepository,
  getOutletByIdRepository,
  getOutletRepository,
  registerOutletRepository,
  removeOutletUserRepository,
  updateOutletRepository,
} from "./outlet.repository.js";

export const registerOutletService = async (req) => {
  const { name, location } = req.body;
  const data = {
    name,
    location,
  };

  const registerOutlet = await registerOutletRepository(req.user.userId, data);
  if (!registerOutlet) throw new InternalServerError("Failed register outlet");

  return registerOutlet;
};

export const updateOutletService = async (req) => {
  const { name, location } = req.body;
  const data = {
    name,
    location,
  };

  const outletIds = await findByIdOutletInUserRepository(req.user.userId);
  if (!outletIds) throw new NotFoundError("Outlet id not found");
  const updateOutlet = await updateOutletRepository(
    outletIds.outletId._id,
    data
  );
  if (!updateOutlet) throw new InternalServerError("Failed update outlet");

  return updateOutlet;
};

export const deleteOutlet = async (req) => {
  const outletIds = await findByIdOutletInUserRepository(req.user.userId);
  const removeOutlet = await deleteOutletRepository(outletIds.outletId._id);
  if (!removeOutlet) throw new InternalServerError("Failed remove outlet");

  const removeOutletUser = await removeOutletUserRepository(req.user.userId);
  if (!removeOutletUser)
    throw new InternalServerError("Failed remove outlet in user");

  return removeOutletUser;
};

export const getOutletService = async (req) => {
  const { sort, page, limit } = req.query;
  const filter = {};
  const options = {
    page,
    limit,
    sort,
    populate: "",
  };

  const outlets = await getOutletRepository(filter, options);
  if (!outlets) throw new NotFoundError("outlet not found");

  return outlets;
};

export const getOutletByIdService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id ");

  return await getOutletByIdRepository(id);
};
