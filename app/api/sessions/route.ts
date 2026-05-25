import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Session } from "@/models";

// ✅ GET
export async function GET() {
  await connectDB();

  const sessions = await Session.find();

  return NextResponse.json({
    success: true,
    data: sessions,
  });
}

// ✅ POST ✅ FIX FINAL
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  console.log("BODY:", body); // DEBUG

  const session = await Session.create({
    athleteId: body.athleteId,
    type: body.type,
    duration: body.duration,
    day: body.day,
    hour: body.hour, // ✅ مهم
  });

  console.log("CREATED:", session);

  return NextResponse.json({
    success: true,
    data: session,
  });
}




