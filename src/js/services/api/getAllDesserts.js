import { apiInstance } from './api';

export const getAllDesserts = async ({
  page = 1,
  limit = 8,
  category = '',
}) => {
  const response = await apiInstance.get('/desserts', {
    params: { page, limit, category },
  });
  return response.data;
};
