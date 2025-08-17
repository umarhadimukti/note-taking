export interface IUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUserSignin {
  email: string;
  password: string;
}

export interface User {
  id: string
  name: string | null
  email: string
}

export interface Note {
  id: string
  title: string
  content: string
  isPublic: boolean
  createdAt: string
  author: User
  comments: Comment[]
  _count: { comments: number }
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  author: User
}

export interface INotePayload {
  title: string;
  content: string;
  isPublic: boolean;
}