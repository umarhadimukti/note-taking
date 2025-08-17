import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { IUserPayload } from "@/types";
import { redirect } from "next/navigation";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
}

export const verifyPassword = async (password: string, hashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
}

export const createUser = async (name: string, email: string, password: string): Promise<{id: string, name: string, email: string}> => {
  const hashedPassword = await hashPassword(password);
  return await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword
    },
    select: { id: true, name: true, email: true }
  });
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return !!cookieStore.get("user-session")?.value;
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("user-session");
  redirect("/auth/signin");
}