import { IUserSignin } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password }: IUserSignin = await request.json();

    const user = await authenticateUser(email, password);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const response = NextResponse.json({ message: "Sign in successul", data: user })

    response.cookies.set("user-session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 1 minggu
    });

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message || "Bad Request" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}