import { apiInstance } from './api';

export const getFeedbacks = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiInstance.get('/feedbacks', {
    params: { page, limit },
  });
  return response.data;
};
