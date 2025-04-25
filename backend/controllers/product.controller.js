import { InternalServerError, NotFoundError } from "../../utils/error.js";
import { paginate } from "../../utils/paginate.js";
import Category from "../models/category.model.js";
import Outlet from "../models/outlet.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getProduct = async (req, res) => {
    const { page, limit } = req.query;

    const startIndex = (page - 1) * limit;

    const products = await Product.find({})
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();

    const total = await Product.countDocuments({});

    if (!products) {
        throw new NotFoundError("Outlet not found");
    }

    const pagination = await paginate({
        length: total,
        limit,
        page,
        req,
    });

    res.status(200).json({
        success: true,
        message: "Products",
        page: pagination,
        data: products,
    });
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid product id");
    }

    const product = await Product.findById(id).populate("categoryId", "name");

    if (!product) {
        throw new NotFoundError("Products not found");
    }

    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product,
    });
};

export const createProduct = async (req, res) => {
    const outletIds = await User.findById(req.user.userId).populate("outletId");

    let newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        categoryId: req.body.categoryId,
        outletId: outletIds.outletId._id,
    });

    const createdProduct = await newProduct.save();

    if (!createdProduct) {
        throw new InternalServerError("Product not created");
    }

    res.status(200).json({
        success: true,
        message: "Product created successfully",
        data: newProduct,
    });
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid product id");
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
        new: true,
    });

    if (!updatedProduct) {
        throw new InternalServerError("Product not updated");
    }

    res.status(201).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
    });
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            message: "Invalid product id",
        });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        throw new InternalServerError("Product not deleted");
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
};

export const searchProduct = async (req, res) => {
    const { keyword } = req.query;

    const categories = await Category.find({
        name: { $regex: keyword, $options: "i" },
    });
    const outlets = await Outlet.find({
        name: { $regex: keyword, $options: "i" },
    });

    const categoryIds = categories.map((cat) => cat._id);
    const outletIds = outlets.map((auth) => auth._id);

    let searchCondition = [
        { name: { $regex: keyword, $options: "i" } },
        { categoryId: { $in: categoryIds } },
        { outletId: { $in: outletIds } },
    ];

    if (!isNaN(keyword)) {
        searchCondition.push({ price: Number(keyword) });
    }

    const findProduct = await Product.find({ $or: searchCondition }).populate(
        "categoryId outletId"
    );

    if (!findProduct.length) {
        throw new NotFoundError("Product not found");
    }

    return res.status(200).json({
        status: true,
        message: "Successfully fetch product",
        data: findProduct,
    });
};
