import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json({
        success: false,
        message: "Email and password required",
      });
    }

    const email = body.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const valid = await bcrypt.compare(body.password, user.password);

    if (!valid) {
      return NextResponse.json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.log("LOGIN ERROR:", error);

    return NextResponse.json({
      success: false,
      message: error.message || "Login error",
    });
  }
}
