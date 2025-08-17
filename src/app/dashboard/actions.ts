"use server";

import { api } from "@/lib/apiClient";
import { logout } from "@/lib/auth";
import { IUserPayload } from "@/types";
import { cookies } from "next/headers";

export const getAllNotes = async () => {
  const response = await api.get("/notes");
  return response.data.notes;
}

export const createNote = async (payload: IUserPayload) => {
  const response = await api.post("/notes", payload);
  return response.data.note;
}

export const getUser = async () => {
  const cookieStore = await cookies();
  const userFromCookie = cookieStore.get("user-session");
  const user = userFromCookie ? JSON.parse(userFromCookie.value) : null;
  
  return user;
}

export const logoutUser = async () => {
  await logout();
}