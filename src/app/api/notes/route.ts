import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const rawUserCookie = request.cookies.get("user-session");
    const userFromCookie = rawUserCookie && JSON.parse(rawUserCookie.value);
    const user = await prisma.user.findUnique({ where: { email: userFromCookie.email } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawUserCookie = request.cookies.get("user-session");
    const userFromCookie = rawUserCookie && JSON.parse(rawUserCookie.value);
    const user = await prisma.user.findUnique({ where: { email: userFromCookie.email } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, isPublic } = await request.json();

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
    });

    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}