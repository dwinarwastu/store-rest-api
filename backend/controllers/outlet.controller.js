import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../../utils/error.js";
import Outlet from "../models/outlet.model.js";
import User from "../models/user.model.js";
import { paginate } from "../../utils/paginate.js";

export const registerOutlet = async (req, res) => {
    let outlet = new Outlet({
        name: req.body.name,
        location: req.body.location,
    });

    const saveOutlet = await outlet.save();

    if (!saveOutlet) {
        throw new InternalServerError("Save outlet failed");
    }

    const updateUser = await User.findByIdAndUpdate(
        req.user.userId,
        { outletId: saveOutlet._id },
        { new: true }
    ).populate("outletId");

    if (!updateUser) {
        throw new InternalServerError("Update user outlet failed");
    }

    res.status(200).json({
        success: true,
        message: "Registration outlet successfully",
        data: updateUser,
    });
};

export const updatedOutlet = async (req, res) => {
    const outletIds = await User.findById(req.user.userId).populate("outletId");

    const updateOutlet = await Outlet.findByIdAndUpdate(
        outletIds.outletId._id,
        {
            name: req.body.name,
            location: req.body.location,
        },
        { new: true }
    );

    if (!updateOutlet) {
        throw new InternalServerError("Update outlet failed");
    }

    res.status(200).json({
        success: true,
        message: "Update outlet successfully",
        data: updateOutlet,
    });
};

export const deleteOutlet = async (req, res) => {
    const outletIds = await User.findById(req.user.userId).populate("outletId");

    const removeOutlet = await Outlet.findByIdAndDelete(outletIds.outletId._id);

    if (!removeOutlet) {
        throw new InternalServerError("Failed remove oulet");
    }

    const removeOutletUser = await User.findByIdAndUpdate(
        req.user.userId,
        { $set: { outletId: null } },
        { new: true }
    );

    if (!removeOutletUser) {
        throw new InternalServerError("Failed remove outlet in user");
    }

    res.status(200).json({
        success: true,
        message: "Outlet successfully remove",
    });
};

export const getOutlets = async (req, res) => {
    const { page, limit } = req.query;

    const startIndex = (page - 1) * limit;

    const outlets = await Outlet.find({})
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();

    const total = await Outlet.countDocuments({});

    if (!outlets) {
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
        message: "Outlets",
        page: pagination,
        data: outlets,
    });
};

export const getOutlet = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid product");
    }

    const outlet = await Outlet.find();

    res.status(200).json({
        success: true,
        message: "Successfully get outlet by id",
        data: outlet,
    });
};
