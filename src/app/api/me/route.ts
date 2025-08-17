import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userFromCookie = request.cookies.get("user-session");
  if (!userFromCookie) {
    return NextResponse.json(
      { error: "No token provided" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { user: JSON.parse(userFromCookie.value) },
    { status: 200 }
  );
}