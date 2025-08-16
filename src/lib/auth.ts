import { IUserPayload } from "@/types";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
}

export const verifyPassword = async (password: string, hashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
}

export const createUser = async (payload: IUserPayload): Promise<{name: string, email: string}> => {
  const hashedPassword = await hashPassword(payload.password);
  return await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword
    },
    select: { name: true, email: true }
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