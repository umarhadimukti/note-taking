import { NextRequest, NextResponse } from "next/server";

export function POST(request: NextRequest) {
  request.cookies.delete("user-session");
  return NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );
}