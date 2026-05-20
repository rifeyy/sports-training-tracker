import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const hashed = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    email: body.email,
    password: hashed,
  });

  return NextResponse.json({ success:true, data:user });
}
