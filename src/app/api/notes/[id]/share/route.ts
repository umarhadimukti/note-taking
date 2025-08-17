import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getUserFromCookie(request: NextRequest) {
  const userCookie = request.cookies.get('user-session');
  if (!userCookie) return null;
  return JSON.parse(userCookie.value);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromCookie(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();
    const noteId = params.id;

    // find the target user
    const targetUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // check if note exists and user owns it
    const note = await prisma.note.findUnique({
      where: { id: noteId }
    });
    if (!note || note.authorId !== user.id) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    // create share relationship
    await prisma.sharedNote.create({
      data: {
        noteId,
        userId: targetUser.id
      }
    });

    return NextResponse.json({ message: 'Note shared successfully' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Note already shared with this user' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to share note' }, { status: 500 });
  }
}