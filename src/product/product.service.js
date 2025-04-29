import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../../utils/error.js";
import {
  createProductRepository,
  getOutletByUser,
  getProductByIdRepository,
  getProductRepository,
  searchProductRepository,
  updateProductRepository,
  deleteProductRepository,
} from "./product.repository.js";

export const getProductService = async (req) => {
  const { sort, page, limit } = req.query;
  const filter = {};
  const options = {
    page,
    limit,
    sort,
    populate: "categoryId outletId",
  };

  const products = await getProductRepository(filter, options);
  if (!products) throw new NotFoundError("product not found");

  return products;
};

export const getProductByIdService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const product = await getProductByIdRepository(id);
  if (!product) throw new NotFoundError("Product not found");

  return product;
};

export const createProductService = async (req) => {
  const outletIds = await getOutletByUser(req.user.userId);
  const { name, price, image, categoryId } = req.body;

  const data = {
    name,
    price,
    image,
    categoryId,
    outletId: outletIds.outletId._id,
  };

  const createProduct = await createProductRepository(data);
  if (!createProduct) throw new InternalServerError("Failed create product");

  return createProduct;
};

export const updateProductService = async (req) => {
  const { id } = req.params;
  const productData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const updateProduct = await updateProductRepository(id, productData);
  if (!updateProduct) throw new InternalServerError("Failed update product");

  return updateProduct;
};

export const deleteProductService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const deleteProduct = await deleteProductRepository(id);
  if (!deleteProduct) throw new InternalServerError("Failed delete product");

  return deleteProduct;
};

export const searchProductService = async (req) => {
  const { keyword } = req.query;
  const findProduct = await searchProductRepository(keyword);

  if (!findProduct.length) throw new NotFoundError("Product not found");

  return findProduct;
};
