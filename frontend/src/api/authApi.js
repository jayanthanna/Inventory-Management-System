import axiosClient from './axiosClient';

export const registerUser = (data) =>
  axiosClient.post('/api/auth/register', data);

export const loginUser = (data) =>
  axiosClient.post('/api/auth/login', data);
