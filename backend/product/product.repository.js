import Category from "../models/category.model.js";
import Outlet from "../models/outlet.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getProductRepository = async (startIndex, limit) => {
    return await Product.find({}).skip(startIndex).limit(limit).lean().exec();
};

export const countProductRepository = async () => {
    return await Product.countDocuments({});
};

export const getProductByIdRepository = async (id) => {
    return await Product.findById(id)
        .populate("categoryId", "name")
        .populate("outletId", "name");
};

export const createProductRepository = async (data) => {
    const newProduct = new Product(data);
    return await newProduct.save();
};

export const updateProductRepository = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProductRepository = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export const searchProductRepository = async (keyword) => {
    const categories = await Category.find({
        name: { $regex: keyword, $options: "i" },
    });
    const outlets = await Outlet.find({
        name: { $regex: keyword, $options: "i" },
    });

    const categoryIds = categories.map((cat) => cat._id);
    const outletIds = outlets.map((out) => out._id);

    let searchCondition = [
        { name: { $regex: keyword, $options: "i" } },
        { categoryId: { $in: categoryIds } },
        { outletId: { $in: outletIds } },
    ];

    if (!isNaN(keyword)) searchCondition.push({ price: Number(keyword) });

    return await Product.find({ $or: searchCondition }).populate(
        "categoryId outletId"
    );
};

export const getOutletByUser = async (id) => {
    return await User.findById(id).populate("outletId");
};
