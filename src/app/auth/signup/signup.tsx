import { IUserPayload } from '../../../types/index';
import { api } from '@/lib/apiClient';

export const signupUser = async ({ name, email, password }: IUserPayload) => {
  const response = await api.post("/auth/signup", { name, email, password });
  return response.data;
}