import { InternalServerError, NotFoundError } from "../../utils/error.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";
import { paginate } from "../../utils/paginate.js";

export const getCategory = async (req, res) => {
    const { page, limit } = req.query;

    const startIndex = (page - 1) * limit;

    const categories = await Category.find({})
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();

    const total = await Category.countDocuments({});

    if (!categories) {
        throw new NotFoundError("Category not found");
    }

    const pagination = await paginate({
        length: total,
        limit,
        page,
        req,
    });

    res.status(200).json({
        success: true,
        message: "Category",
        page: pagination,
        data: categories,
    });
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id category");
    }

    const categories = await Category.findById(id);

    if (!categories) {
        throw new NotFoundError("Category not found");
    }

    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: categories,
    });
};

export const createdCategory = async (req, res) => {
    const categories = req.body;
    const newCategory = new Category(categories);

    const createdCategory = await newCategory.save();

    if (!createdCategory) {
        throw new InternalServerError("Category not created");
    }

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
    });
};

export const updatedCategory = async (req, res) => {
    const { id } = req.params;
    const categories = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid cartegory id");
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, categories, {
        new: true,
    });

    if (!updatedCategory) {
        throw new InternalServerError("Category not updated");
    }

    res.status(201).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
};

export const deletedCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid category id");
        return res
            .status(404)
            .json({ success: false, message: "Invalid category id" });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
        throw new InternalServerError("Category not deleted");
    }

    res.status(200).json({
        success: true,
        message: "Category daleted successfully",
        data: deletedCategory,
    });
};
