import { apiInstance } from './api';

export const getDessertById = async id => {
  const response = await apiInstance.get(`/desserts/${id}`);
  return response.data;
};
