import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const user = await User.findOne({ email: body.email });

  if (!user) {
    return NextResponse.json({ success:false, message:"User not found" });
  }

  const valid = await bcrypt.compare(body.password, user.password);

  if (!valid) {
    return NextResponse.json({ success:false, message:"Wrong password" });
  }

  const token = signToken({ id: user._id });

  return NextResponse.json({ success:true, token });
}
