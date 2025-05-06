import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../utils/error.js";
import {
  createOrderItemsRepository,
  createOrderRepository,
  deleteOrderItemsRepository,
  deleteOrderRepository,
  findByIdOrderRepository,
  findByIdProductRepository,
  findOneOrderItemsRepository,
  getOrderItemsRepository,
  getOrderRepository,
  getOrdersRepository,
  getOrderUserRepository,
  getProductFindByIdRepository,
  getProductsRepository,
  removeOrderItemRepository,
  removeOrderRepository,
  updateStatusOrderRepository,
  updateOrderRepository,
} from "./order.repository.js";

export const getOrderOutletService = async (req) => {
  const products = await getProductsRepository(req.user.outletId);
  if (!products) throw new NotFoundError("Product not found");

  const productIds = products.map((product) => product._id);
  const orderItems = await getOrderItemsRepository(productIds);
  if (!orderItems) throw new NotFoundError("Order item not found");

  const orderItemsIds = orderItems.map((orderItem) => orderItem._id);
  const orders = await getOrderRepository(orderItemsIds, productIds);
  if (!orders) throw new NotFoundError("Order by outlet not found");

  const filteredOrders = orders.map((order) => ({
    ...order.toObject(),
    orderItemId: order.orderItemId.filter((item) => item.products !== null),
    totalPrice: order.orderItemId.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0),
  }));

  return filteredOrders;
};

export const getOrderUserService = async (req) => {
  const get = await getOrderUserRepository(req.user.userId);
  if (!get) throw new NotFoundError("Order not found");
  return get;
};

export const createOrderService = async (req) => {
  const { orderItems, shippingAddress, phone, status } = req.body;
  let orderItemIds = [];
  let total = 0;

  for (const orderItem of orderItems) {
    const product = await findByIdProductRepository(orderItem.product);
    if (!product) throw new NotFoundError("Product not found");

    const dataOrderItems = {
      products: orderItem.product,
      quantity: orderItem.quantity,
    };

    let newOrderItem = await createOrderItemsRepository(dataOrderItems);
    if (!newOrderItem) throw new InternalServerError("Failed save order item");

    orderItemIds.push(newOrderItem._id);
    total += product.price * orderItem.quantity;
  }

  const dataOrder = {
    orderItemId: orderItemIds,
    shippingAddress,
    phone,
    status,
    totalPrice: total,
    userId: req.user.userId,
  };

  let newOrder = await createOrderRepository(dataOrder);
  if (!newOrder) throw new InternalServerError("Failed save order");

  return newOrder;
};

export const updateStatusOrderService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const { status } = req.body;
  if (!status) throw new InternalServerError("Invalid request status");

  const order = await updateStatusOrderRepository(id, status);
  if (!order) throw new InternalServerError("Failed update status order");

  return order;
};

export const deleteOrderService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const deleteOrder = await deleteOrderRepository(id);

  if (deleteOrder) {
    const deleteOrderItems = deleteOrder.orderItemId.map(async (orderItem) => {
      await deleteOrderItemsRepository(orderItem);
    });

    if (!deleteOrderItems)
      throw new InternalServerError("Failed delete order item");
  } else {
    throw new InternalServerError("Failed delete order");
  }

  return deleteOrder;
};

export const getOrderService = async (req) => {
  const { sort, page, limit } = req.query;
  const filter = {};
  const options = {
    page,
    limit,
    sort,
    populate: [
      {
        path: "orderItemId",
        populate: {
          path: "products",
          model: "Product",
          populate: {
            path: "categoryId",
            select: "name",
          },
        },
      },
      {
        path: "userId",
        select: "username email",
      },
    ],
  };

  const orders = await getOrdersRepository(filter, options);

  return orders;
};

export const deleteOrderItemsService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id order");

  const { orderItemId } = req.body;
  if (!orderItemId) throw new InternalServerError("Invalid id order item");

  const orderItemDoc = await findOneOrderItemsRepository(orderItemId);
  const orderRemove = await removeOrderRepository(id, orderItemDoc._id);
  const orderItemRemove = await removeOrderItemRepository(orderItemDoc._id);

  if (!orderItemRemove)
    throw new InternalServerError("Failed remove order item");

  if (orderRemove) {
    const updateOrder = await findByIdOrderRepository(id);
    const newTotalPrice = updateOrder.orderItemId.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0);

    updateOrder.totalPrice = newTotalPrice;
    await createOrderRepository(updateOrder);
  } else {
    throw new InternalServerError("Failed update order");
  }

  const dataOrder = await findByIdOrderRepository(id);

  return dataOrder;
};

export const getOrderByidService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id");

  const order = await findByIdOrderRepository(id);
  if (!order) throw new NotFoundError("Order not found");

  return order;
};

export const addOrderItemService = async (req) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new InternalServerError("Invalid id order");

  const { orderItems } = req.body;

  let orderItemIds = [];

  for (const orderItem of orderItems) {
    const product = await getProductFindByIdRepository(req);
    if (!product) throw new NotFoundError("Product not found");

    data = {
      products: orderItem.product,
      quantity: orderItem.quantity,
    };

    let newOrderItem = await createOrderItemsRepository(data);
    if (!newOrderItem) throw new InternalServerError("Failed save order item");

    orderItemIds.push(newOrderItem._id);
  }

  const updateOrder = await updateOrderRepository(id, orderItemIds);

  if (updateOrder) {
    const updatePriceOrder = await findByIdOrderRepository(id);
    const newTotalPrice = updatePriceOrder.orderItemId.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0);

    updateOrder.totalPrice = newTotalPrice;
    await updateOrder.save();
  } else {
    throw new InternalServerError("Update price failed");
  }

  const dataOrder = await findByIdOrderRepository(id);

  return dataOrder;
};
