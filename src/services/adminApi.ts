
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling (401, etc)
let unauthorizedNotified = false;
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!unauthorizedNotified) {
        unauthorizedNotified = true;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        toast({
          title: 'Session expired',
          description: 'You are not authorized. Please log in again.',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2500);
      }
      return Promise.reject({ ...error, unauthorized: true });
    }
    return Promise.reject(error);
  }
);

export async function getUnitPrices() {
  const res = await adminApi.get('/materials/unit-prices/');
  return res.data;
}

export async function createUnitPrice(data: any) {
  const res = await adminApi.post('/materials/unit-prices/', data);
  return res.data;
}

export async function updateUnitPrice(id: number, data: any) {
  const res = await adminApi.put(`/materials/unit-prices/${id}/`, data);
  return res.data;
}

export async function deleteUnitPrice(id: number) {
  await adminApi.delete(`/materials/unit-prices/${id}/`);
}

export async function getExchangeRates() {
  const res = await adminApi.get('/materials/exchange-rates/');
  return res.data;
}

export async function createExchangeRate(data: any) {
  const res = await adminApi.post('/materials/exchange-rates/', data);
  return res.data;
}

export async function updateExchangeRate(id: number, data: any) {
  const res = await adminApi.put(`/materials/exchange-rates/${id}/`, data);
  return res.data;
}

export async function deleteExchangeRate(id: number) {
  await adminApi.delete(`/materials/exchange-rates/${id}/`);
}

export async function getUsers() {
  const res = await adminApi.get('/users/');
  return res.data;
}

// Add create/update/delete stubs as needed
