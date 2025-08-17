"use client";

import { Container, Stack } from "@mui/material";
import { useState } from "react";
import { Note, User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createNote, getAllNotes, getUser, logoutUser } from "./actions";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareNoteId, setShareNoteId] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentNoteId, setCommentNoteId] = useState('');
  const [showComments, setShowComments] = useState<string>('');

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();

    console.log(user)
  }, []);

  // fetch notes pakai useQuery
  const { data, isPending, isError } = useQuery<{notes: Note[]}>({
    queryKey: ["notes"],
    queryFn: getAllNotes
  });
  const notes = data?.notes ?? [];

  // create note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setTitle("");
      setContent("");
      setIsPublic(false);
      setShowCreateForm(false);
    }
  });
  
  return (
    <Container className="min-h-screen bg-neutral-900 font-[Jost]">
      <nav className="bg-neutral-900 shadow-sm border-b border-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Notes Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span>Welcome, {user?.name}</span>
              )}
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                New Note
              </button>
              <button
                onClick={logoutUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </Container>
  )
}