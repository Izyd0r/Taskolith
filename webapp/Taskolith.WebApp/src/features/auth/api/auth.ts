import apiClient from '@/lib/axios';
import { type LoginCredentials, type SignupCredentials, type LoginResponse, type SignupResponse } from '@/features/auth/types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
  const { data } = await apiClient.post('/auth/register', credentials);
  return data;
};
