import {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoryService,
  updateCategoryService,
} from "./category.service.js";

export const getCategory = async (req, res) => {
  const get = await getCategoryService(req);

  res.status(200).json({
    message: "Successfully fetch category",
    data: get,
  });
};

export const getCategoryById = async (req, res) => {
  const getById = await getCategoryByIdService(req);

  res.status(200).json({
    message: "Successfully fetch category",
    data: getById,
  });
};

export const createdCategory = async (req, res) => {
  const create = await createCategoryService(req);

  res.status(200).json({
    message: "Successfully create category",
    data: create,
  });
};

export const updatedCategory = async (req, res) => {
  const update = await updateCategoryService(req);

  res.status(200).json({
    message: "Successfully update category",
    data: update,
  });
};

export const deletedCategory = async (req, res) => {
  const deleted = await deleteCategoryService(req);

  res.status(200).json({
    message: "Successsfully delete category",
    data: deleted,
  });
};
