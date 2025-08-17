"use client";

import { Container, Stack } from "@mui/material";
import { useState } from "react";
import { Note, User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createComment, createNote, getAllNotes, getCurrentUser, logoutUser, shareNote } from "./actions";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

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
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();

  }, []);

  // fetch notes pakai useQuery
  const { data: notes =[], isPending, isError } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: getAllNotes
  });

  // create note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setTitle("");
      setContent("");
      setIsPublic(false);
      setShowCreateForm(false);
    }
  });

  // share note mutation
  const shareNoteMutation = useMutation({
    mutationFn: shareNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setShareEmail("");
      setShareNoteId("");
    }
  })

  // comment mutation 
  const commentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setCommentContent("");
      setCommentNoteId("");
    }
  });

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth/signin");
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load notes.
      </div>
    );
  }
  
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer"
              >
                New Note
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No notes yet. Create your first note!
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    note.isPublic
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {note.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="text-sm text-gray-500 mb-4">
                By {note.author.name || note.author.email}
                <br />
                {new Date(note.createdAt).toLocaleDateString()}
              </div>

              {/* Share */}
              {user?.id === note.author.id && (
                <div>
                  {shareNoteId === note.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        placeholder="Enter email to share with"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() =>
                          shareNoteMutation.mutate({ noteId: note.id, email: shareEmail })
                        }
                        disabled={shareNoteMutation.isPending}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        {shareNoteMutation.isPending ? "Sharing..." : "Share"}
                      </button>
                      <button
                        onClick={() => setShareNoteId("")}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShareNoteId(note.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Share Note
                    </button>
                  )}
                </div>
              )}

              {/* Comments */}
              <div>
                <button
                  onClick={() =>
                    setShowComments(showComments === note.id ? "" : note.id)
                  }
                  className="text-blue-500 hover:underline text-sm"
                >
                  {note._count.comments} Comments
                </button>

                {showComments === note.id && (
                  <div className="mt-2 space-y-2">
                    {/* Add Comment */}
                    {commentNoteId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Add a comment..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-gray-700 text-sm h-20"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              commentMutation.mutate({
                                noteId: note.id,
                                content: commentContent,
                              })
                            }
                            disabled={commentMutation.isPending}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            {commentMutation.isPending
                              ? "Adding..."
                              : "Add Comment"}
                          </button>
                          <button
                            onClick={() => setCommentNoteId("")}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCommentNoteId(note.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Add Comment
                      </button>
                    )}

                    {/* List Comments */}
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {note.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-100 p-2 rounded text-sm border"
                        >
                          <p className="mb-1 text-gray-800">{comment.content}</p>
                          <div className="text-xs text-gray-500">
                            By {comment.author.name || comment.author.email} •{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Note Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800">Create New Note</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNoteMutation.mutate({ title, content, isPublic });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-neutral-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-neutral-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-neutral-700">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-32 text-neutral-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center text-neutral-700">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  Make this note public
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-neutral-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  )
}