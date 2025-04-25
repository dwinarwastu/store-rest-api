import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../../utils/error.js";
import { paginate } from "../../utils/paginate.js";
import {
  countCategoryRepository,
  createCategoryRepository,
  deleteCategoryRepository,
  getCategoryByIdRepository,
  getCategoryRepository,
  updateCategoryRepository,
} from "./category.repository.js";

export const getCategoryService = async (req) => {
  const { page, limit } = req.query;
  const startIndex = (page - 1) * limit;
  const categories = await getCategoryRepository(startIndex, limit);
  const total = await countCategoryRepository();

  if (!categories) throw new NotFoundError("Category not found");

  const pagination = await paginate({
    length: total,
    limit,
    page,
    req,
  });

  return { pagination, categories };
};

export const getCategoryByIdService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const categories = await getCategoryByIdRepository(id);
  if (!categories) throw new NotFoundError("Category not found");

  return categories;
};

export const createCategoryService = async (req) => {
  const { name } = req.body;
  const data = {
    name,
  };

  const createCategory = await createCategoryRepository(data);
  if (!createCategory) throw new InternalServerError("Failed create category");

  return createCategory;
};

export const updateCategoryService = async (req) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = {
    name,
  };

  const updateCategory = await updateCategoryRepository(id, data);
  if (!updateCategory) throw new InternalServerError("Failed update category");

  return updateCategory;
};

export const deleteCategoryService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const deleteCategory = await deleteCategoryRepository(id);
  if (!deleteCategory) throw new InternalServerError("Failef delete category");

  return deleteCategory;
};
