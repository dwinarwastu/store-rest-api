import {
  createOrderService,
  deleteOrderItemsService,
  deleteOrderService,
  getOrderByidService,
  getOrderOutletService,
  getOrderService,
  getOrderUserService,
  updateStatusOrderService,
} from "./order.service.js";

export const getOrderOutlet = async (req, res) => {
  const get = await getOrderOutletService(req);

  res.status(200).json({
    message: "Successfully fetch order data",
    data: get,
  });
};

export const getOrderUser = async (req, res) => {
  const get = await getOrderUserService(req);

  res.status(200).json({
    message: "Successfully fetch order user data",
    data: get,
  });
};

export const createOrder = async (req, res) => {
  const create = await createOrderService(req);

  res.status(200).json({
    message: "Successfully create order",
    data: create,
  });
};

export const updateStatusOrder = async (req, res) => {
  const update = await updateStatusOrderService(req);

  res.status(200).json({
    message: "Successfully update status order",
    data: update,
  });
};

export const deletedOrder = async (req, res) => {
  const deleted = await deleteOrderService(req);

  res.status(200).json({
    message: "Successfully delete order",
  });
};

export const getOrder = async (req, res) => {
  const get = await getOrderService(req);

  res.status(200).json({
    message: "Successfully fetch order",
    data: get,
  });
};

export const deletedOrderItems = async (req, res) => {
  const deleted = await deleteOrderItemsService(req);

  res.status(200).json({
    message: "Successfully delete order",
    data: deleted,
  });
};

export const getOrderById = async (req, res) => {
  const get = await getOrderByidService(req);

  res.status(200).json({
    message: "Successfully fetch data order by id",
    data: get,
  });
};

export const addOrderItem = async (req, res) => {
  const add = await addOrderItemService(req);

  res.status(200).json({
    message: " Successfully add order item",
    data: add,
  });
};
