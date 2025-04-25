import { deleteCategoryService } from "../category/category.service.js";
import {
  getOutletByIdService,
  getOutletService,
  registerOutletService,
  updateOutletService,
} from "./outlet.service.js";

export const registerOutlet = async (req, res) => {
  const register = await registerOutletService(req);

  res.status(200).json({
    message: "Registration outlet successfully",
    data: register,
  });
};

export const updatedOutlet = async (req, res) => {
  const update = await updateOutletService(req);

  res.status(200).json({
    message: "Update outlet successfully",
    data: update,
  });
};

export const deleteOutlet = async (req, res) => {
  const deleted = await deleteCategoryService(req);

  res.status(200).json({
    message: "Delete outlet successfully",
    data: deleted,
  });
};

export const getOutlets = async (req, res) => {
  const get = await getOutletService(req);

  res.status(200).json({
    message: "Successfully fetch outlet",
    data: get,
  });
};

export const getOutlet = async (req, res) => {
  const get = await getOutletByIdService(req);

  res.status(200).json({
    message: "Successfully fetch outlet",
    data: get,
  });
};
