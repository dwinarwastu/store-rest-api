import Category from "./category.model.js";

export const getCategoryRepository = async (filter = {}, options = {}) => {
  return await Category.paginate(filter, options);
};

export const getCategoryByIdRepository = async (id) => {
  return await Category.findById(id);
};

export const createCategoryRepository = async (data) => {
  const newCategory = new Category(data);
  return await newCategory.save();
};

export const updateCategoryRepository = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategoryRepository = async (id) => {
  const category = await Category.findById(id);
  return category.softDelete();
};
