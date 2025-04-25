import { InternalServerError, NotFoundError } from "../../utils/error.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import OrderItems from "../models/orderItems.model.js";
import mongoose from "mongoose";
import { paginate } from "../../utils/paginate.js";

export const getOrderOutlet = async (req, res) => {
    const products = await Product.find({ outletId: req.user.outletId }).select(
        "_id"
    );

    if (!products) {
        throw new NotFoundError("Product not found");
    }

    const productIds = products.map((product) => product._id);

    const orderItems = await OrderItems.find({
        products: { $in: productIds },
    }).select("_id");

    if (!orderItems) {
        throw new NotFoundError("Order item not found");
    }

    const orderItemsIds = orderItems.map((orderItem) => orderItem._id);

    const orders = await Order.find({ orderItemId: { $in: orderItemsIds } })
        .populate({
            path: "orderItemId",
            populate: {
                path: "products",
                match: { _id: { $in: productIds } },
            },
        })
        .populate("userId");

    if (!orders) {
        throw new NotFoundError("Order by outlet not found");
    }

    const filteredOrders = orders.map((order) => ({
        ...order.toObject(),
        orderItemId: order.orderItemId.filter((item) => item.products !== null),
        totalPrice: order.orderItemId.reduce((total, item) => {
            return total + (item.products?.price || 0) * item.quantity;
        }, 0),
    }));

    res.status(200).json({
        success: true,
        message: "Order by outlet",
        data: filteredOrders,
    });
};

export const getOrderUser = async (req, res) => {
    const get = await Order.find({ userId: req.user.userId }).populate({
        path: "orderItemId",
        populate: {
            path: "products",
            model: "Product",
            populate: {
                path: "categoryId",
            },
        },
    });

    if (!get) {
        throw new NotFoundError("Order not found");
    }

    res.status(200).json({
        success: true,
        message: "Order for user",
        data: get,
    });
};

export const createOrder = async (req, res) => {
    let orderItemIds = [];

    let total = 0;

    for (const orderItem of req.body.orderItems) {
        const product = await Product.findById(orderItem.products);

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        let newOrderItem = new OrderItems({
            products: orderItem.product,
            quantity: orderItem.quantity,
        });

        const saveOrderItems = await newOrderItem.save();

        if (!saveOrderItems) {
            throw new InternalServerError("Failed save order item");
        }

        orderItemIds.push(newOrderItem._id);

        total += product.price * orderItem.quantity;
    }

    let newOrder = new Order({
        orderItemId: orderItemIds,
        shippingAddress: req.body.shippingAddress,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: total,
        userId: req.user.userId,
    });

    if (!newOrder) {
        throw new InternalServerError("Failed save order");
    }

    res.status(200).json({
        success: true,
        message: "Successfully order",
        data: newOrder,
    });
};

export const updateStatusOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id order");
    }

    const status = req.body.status;

    if (!status) {
        throw new InternalServerError("Invalid request status");
    }

    const order = await Order.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
    )
        .populate("userId", "username")
        .populate({
            path: "orderItemId",
            populate: {
                path: "products",
                model: "Product",
                populate: {
                    path: "categoryId",
                },
            },
        });

    if (!order) {
        throw new InternalServerError("Failed update status in order");
    }

    res.status(200).json({
        success: true,
        message: "Successfully update status in order",
        data: order,
    });
};

export const deletedOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id");
    }

    const deleteOrder = await Order.findOneAndDelete({ _id: id });

    if (deleteOrder) {
        const deleteOrderItems = deleteOrder.orderItemId.map(
            async (orderItem) => {
                await OrderItems.findByIdAndDelete(orderItem);
            }
        );

        if (!deleteOrderItems) {
            throw new InternalServerError("Failed delete order item");
        }
    } else {
        throw new InternalServerError("Failed delete order");
    }

    res.status(200).json({
        success: true,
        message: "Successfully delete order",
    });
};

export const getOrder = async (req, res) => {
    const { page, limit } = req.query;

    const startIndex = (page - 1) * limit;

    const orders = await Order.find({})
        .populate("userId", "username")
        .populate({
            path: "orderItemId",
            populate: {
                path: "products",
                model: "Product",
                populate: {
                    path: "categoryId",
                },
            },
        })
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();

    const total = await Order.countDocuments({});

    if (!orders) {
        throw new NotFoundError("Orders not found");
    }

    const pagination = await paginate({
        length: total,
        limit,
        page,
        req,
    });

    res.status(200).json({
        success: true,
        message: "Orders successfully",
        page: pagination,
        data: orders,
    });
};

export const deletedOrderItems = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id order");
    }

    const orderItemId = req.body.orderItemId;

    if (!orderItemId) {
        throw new InternalServerError("Invalid id order item");
    }

    const orderItemDoc = await OrderItems.findOne({ _id: orderItemId });

    const orderRemove = await Order.findOneAndUpdate(
        { _id: id },
        { $pull: { orderItemId: orderItemDoc._id } },
        { new: true }
    );

    const orderItemRemove = await OrderItems.deleteOne(orderItemDoc._id);

    if (!orderItemRemove) {
        throw new InternalServerError("Failed remove order item");
    }

    if (orderRemove) {
        const updateOrder = await Order.findById(id).populate({
            path: "orderItemId",
            populate: {
                path: "products",
                model: "Product",
            },
        });

        const newTotalPrice = updateOrder.orderItemId.reduce((total, item) => {
            return total + (item.products?.price || 0) * item.quantity;
        }, 0);

        updateOrder.totalPrice = newTotalPrice;
        await updateOrder.save();
    } else {
        throw new InternalServerError("Failed update order");
    }

    const dataOrder = await Order.findById(id).populate({
        path: "orderItemId",
        populate: {
            path: "products",
            model: "Product",
            populate: {
                path: "categoryId",
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Successfully delete order item",
        data: dataOrder,
    });
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id");
    }

    const order = await Order.findById(id).populate({
        path: "orderItemsId",
        populate: {
            path: "products",
            model: "Product",
            populate: {
                path: "categoryId",
            },
        },
    });

    if (!order) {
        throw new NotFoundError("Order not found");
    }

    res.status(200).json({
        success: true,
        message: "Order by id",
        data: order,
    });
};

export const addOrderItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InternalServerError("Invalid id order");
    }

    let orderItemIds = [];

    for (const orderItem of req.body.orderItems) {
        const product = await Product.findById(orderItem.product);

        if (!product) {
            throw new NotFoundError("Poduct not found");
        }

        let newOrderItem = new OrderItems({
            products: orderItem.product,
            quantity: orderItem.quantity,
        });

        const saveOrderItems = await newOrderItem.save();

        if (!saveOrderItems) {
            throw new InternalServerError("Failed save order item");
        }

        orderItemIds.push(newOrderItem._id);
    }

    const updateOrder = await Order.findByIdAndUpdate(
        id,
        { $push: { orderItemId: orderItemIds } },
        { new: true }
    );

    if (updateOrder) {
        const updatePriceOrder = await Order.findById(id).populate({
            path: "orderItemId",
            populate: {
                path: "products",
                model: "Product",
            },
        });

        const newTotalPrice = updatePriceOrder.orderItemId.reduce(
            (total, item) => {
                return total + (item.products?.price || 0) * item.quantity;
            },
            0
        );

        updateOrder.totalPrice = newTotalPrice;
        await updateOrder.save();
    } else {
        throw new InternalServerError("Update price failed");
    }

    const dataOrder = await Order.findById(id).populate({
        path: "orderItemId",
        populate: {
            path: "products",
            model: "Product",
            populate: {
                path: "categoryId",
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Successfully add order item",
        data: dataOrder,
    });
};
