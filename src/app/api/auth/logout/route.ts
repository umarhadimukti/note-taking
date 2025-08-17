import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("user-session");
  return NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );
}