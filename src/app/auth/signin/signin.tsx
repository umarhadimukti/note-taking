import { api } from "@/lib/apiClient"

export const signinUser = async ({ email, password }: { email: string, password: string }) => {
  const response = await api.post("/auth/signin", { email, password });
  return response.data;
}