import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserFromCookie(request: NextRequest) {
  const userCookie = request.cookies.get('user-session');
  if (!userCookie) return null;
  return JSON.parse(userCookie.value);
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromCookie(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { authorId: user.id },
          { isPublic: true },
          { 
            sharedWith: {
              some: { userId: user.id }
            }
          }
        ]
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(
      { notes },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromCookie(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, isPublic } = await request.json()

    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPublic: isPublic || false,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ note })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}