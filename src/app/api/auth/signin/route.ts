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

    return NextResponse
      .json({ message: "Sign in successul", data: user })
      .cookies.set("user-session", JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 minggu
      });
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