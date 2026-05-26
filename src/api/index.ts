import axios from 'axios';

const backendBase = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
const API = axios.create({ baseURL: `${backendBase.replace(/\/$/, '')}/api` });

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('cookme_user');
  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.token) {
      req.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }
  return req;
});

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('video', file);
  const res = await API.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.videoUrl;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.imageUrl;
};

export default API;
