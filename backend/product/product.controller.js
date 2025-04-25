import {
    createProductService,
    deleteProductService,
    getProductByIdService,
    getProductService,
    searchProductService,
    updateProductService,
} from "./product.service.js";

export const getProduct = async (req, res) => {
    const get = await getProductService(req);

    res.status(200).json({
        message: "Successfully fetch product",
        data: get,
    });
};

export const getProductById = async (req, res) => {
    const getById = await getProductByIdService(req);

    res.status(200).json({
        message: "Successfully fetch product by id",
        data: getById,
    });
};

export const createProduct = async (req, res) => {
    const create = await createProductService(req);

    res.status(200).json({
        message: "Successfully create product",
        data: create,
    });
};

export const updateProduct = async (req, res) => {
    const update = await updateProductService(req);

    res.status(200).json({
        message: "Successfully update product",
        data: update,
    });
};

export const deleteProduct = async (req, res) => {
    const deleted = await deleteProductService(req);

    res.status(200).json({
        message: "Successfully delete product",
        data: deleted,
    });
};

export const searchProduct = async (req, res) => {
    const search = await searchProductService(req);

    res.status(200).json({
        message: "Successfully search product",
        data: search,
    });
};
