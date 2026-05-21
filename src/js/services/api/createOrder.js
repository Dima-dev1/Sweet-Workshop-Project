import { apiInstance } from './api';

export const createOrder = async orderData => {
  const response = await apiInstance.post('/orders', orderData);
  return response.data;
};
