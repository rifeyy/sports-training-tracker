import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: body.role || "client",
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.log("REGISTER ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Register error" },
      { status: 500 }
    );
  }
}
