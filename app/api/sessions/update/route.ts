import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Session } from "@/models";

export async function PUT(req: Request) {
  await connectDB();

  const body = await req.json();

  const updated = await Session.findByIdAndUpdate(
    body.id,
    { day: body.day, hour: body.hour },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}