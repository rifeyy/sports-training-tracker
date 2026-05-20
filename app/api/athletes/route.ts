import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Athlete } from "@/models";

// ✅ GET
export async function GET() {
  await connectDB();
  const athletes = await Athlete.find();

  return NextResponse.json({
    success: true,
    data: athletes,
  });
}

// ✅ POST ✅🔥 FIX
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const athlete = await Athlete.create({
    name: body.name,
    sport: body.sport,
    teamId: body.teamId || "", // ✅ هذا هو FIX
  });

  return NextResponse.json({
    success: true,
    data: athlete,
  });
}