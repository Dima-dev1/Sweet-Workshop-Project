import { apiInstance } from './api';

export const getCategories = async () => {
  const response = await apiInstance.get('/categories');
  return response.data;
};
