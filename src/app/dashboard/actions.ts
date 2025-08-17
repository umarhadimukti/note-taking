import { api } from "@/lib/apiClient";
import { INotePayload } from "@/types";

export const getAllNotes = async () => {
  console.log('actions get all notes')
  const response = await api.get("/notes");
  return response.data.notes;
}

export const createNote = async (payload: INotePayload) => {
  const response = await api.post("/notes", payload);
  return response.data.note;
}

export const shareNote = async ({ noteId, email }: { noteId: string, email: string }) => {
  const response = await api.post(`/notes/${noteId}/share`, { email });
  return response.data;
}

export const createComment = async ({ noteId, content }: { noteId: string, content: string }) => {
  const response = await api.post(`/notes/${noteId}/comments`, { content });
  return response.data.comment;
}

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data.user;
}

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
}