import api from './axios'; // same import as your other api files

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};