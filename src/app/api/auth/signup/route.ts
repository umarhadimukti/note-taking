import { IUserPayload } from "@/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: IUserPayload = await request.json();

    if (!name || !email || !password) {
      throw new Error("(Name, Email, Password) fields are required");
    }

    const createdUser = await createUser(name, email, password);

    return NextResponse.json(
      { message: "Sign up successul", data: createdUser }
    )
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message || "Bad Request" },
        { status: 400 }
      )
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 401 }
        )
      }
    }
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}