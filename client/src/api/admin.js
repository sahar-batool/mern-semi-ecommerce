import api from './axios'; // same import as your other api files

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file); // must be named "image", same as upload.single('image')
  const { data } = await api.post('/upload', formData);
  return data.url;
};