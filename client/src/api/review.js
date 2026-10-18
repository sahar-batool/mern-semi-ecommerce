import api from './axios'; // use the same import as products.js

export const getReviews = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
};

export const createReview = async (productId, review) => {
  const { data } = await api.post(`/reviews/product/${productId}`, review);
  return data;
};

export const updateReview = async (id, review) => {
  const { data } = await api.put(`/reviews/${id}`, review);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};