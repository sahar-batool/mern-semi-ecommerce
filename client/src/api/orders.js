
import api from "./axios"; 

export const placeOrder = async (shippingAddress) => {
  const { data } = await api.post("/orders", { shippingAddress });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};