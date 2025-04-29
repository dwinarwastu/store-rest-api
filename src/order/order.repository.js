import Order from "./order.model.js";
import OrderItems from "./orderItems.model.js";
import Product from "../product/product.model.js";

export const getProductsRepository = async (id) => {
  return await Product.find({ outletId: id }).select("_id");
};

export const getOrderItemsRepository = async (productIds) => {
  return await OrderItems.find({ products: { $in: productIds } }).select("_id");
};

export const getOrderRepository = async (orderItemIds, productIds) => {
  return await Order.find({ orderItemId: { $in: orderItemIds } })
    .populate({
      path: "orderItemId",
      populate: {
        path: "products",
        match: { _id: { $in: productIds } },
      },
    })
    .populate("userId");
};

export const getOrderUserRepository = async (id) => {
  return await Order.find({ userId: id }).populate({
    path: "orderItemId",
    populate: {
      path: "products",
      model: "Product",
      populate: {
        path: "categoryId",
      },
    },
  });
};

export const findByIdProductRepository = async (id) => {
  return await Product.findById(id);
};

export const createOrderItemsRepository = async (data) => {
  const newOrderItems = new OrderItems(data);
  return await newOrderItems.save();
};

export const createOrderRepository = async (data) => {
  const newOrder = new Order(data);
  return await newOrder.save();
};

export const updateStatusOrderRepository = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status: status }, { new: true })
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
};

export const deleteOrderRepository = async (id) => {
  return await Order.findOneAndDelete({ _id: id });
};

export const deleteOrderItemsRepository = async (id) => {
  return await OrderItems.findByIdAndDelete(id);
};

export const getOrdersRepository = async (filter = {}, options = {}) => {
  return await Order.paginate(filter, options);
};

export const countOrderRepository = async () => {
  return await Order.countDocuments({});
};

export const findOneOrderItemsRepository = async (id) => {
  return await OrderItems.findOne({ _id: id });
};

export const removeOrderRepository = async (id, orderItemId) => {
  return await Order.findOneAndUpdate(
    { _id: id },
    { $pull: { orderItemId: orderItemId } },
    { new: true }
  );
};

export const removeOrderItemRepository = async (orderItemId) => {
  return await OrderItems.deleteOne(orderItemId);
};

export const findByIdOrderRepository = async (id) => {
  return await Order.findById(id).populate({
    path: "orderItemId",
    populate: {
      path: "products",
      model: "Product",
      populate: {
        path: "categoryId",
      },
    },
  });
};

export const getProductFindByIdRepository = async (id) => {
  return await Product.findById(id);
};

export const updateOrderRepository = async (id, orderItemId) => {
  return await Order.findByIdAndUpdate(
    id,
    { $push: { orderItemId: orderItemId } },
    { new: true }
  );
};
